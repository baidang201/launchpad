import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node }  from '../config/index.js'
import { RealtimeRoundInfo } from '../lib/models/realtimeRoundInfo.js'
import { HistoryRoundInfo } from '../lib/models/historyRoundInfo.js'
import { getTokenInfo } from '../servers/tokeninfo.js'
import {logger} from '../lib/utils/log.js'

const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const LAST_BLOCK = 1477800 //todo use the newest blockhight from blockchain
const LAST_ROUND = 2472
const DEFAULT_OUTPUT = 'null'
const ROUND_CYCLE_TIME = 3600

const queue = new Queue({
  timeout: 90000,
  throwOnTimeout: false,
  concurrency: 1
})

let jsonOutput = DEFAULT_OUTPUT

export const main = async () => {
  const provider = new WsProvider(node.WS_ENDPOINT)
  const api = await ApiPromise.create({ provider, types })

  let roundStartAt = 0
  let currentRound = 0

  const [phalaChain, phalaNodeName, phalaNodeVersion] = (await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ])).map(i => i.toString())
  logger.info({ chain: phalaChain }, `Connected to chain ${phalaChain} using ${phalaNodeName} v${phalaNodeVersion}`)

  return api.rpc.chain.subscribeNewHeads(async header => {
    const number = header.number.toNumber()
    const roundInfo = (await api.query.phalaModule.round.at(header.hash)) || new BN('0')
    const roundNumber = roundInfo.round.toNumber()

    logger.info(`realtime block round #${roundNumber} blocknum#${number}...`)

    return queue.add(() => processRoundAt(header, roundNumber, api).catch(console.error))
  })
}

const processRoundAt = async (header, roundNumber, api) => {
  const blockHash = header.hash
  const number = header.number.toNumber()
  const accumulatedFire2 = (await api.query.phalaModule.accumulatedFire2.at(blockHash)) || new BN('0')
  const accumulatedFire2Decimal = new Decimal(accumulatedFire2.toString())
  const onlineWorkers = await api.query.phalaModule.onlineWorkers.at(blockHash)
  const totalPower = await api.query.phalaModule.totalPower.at(blockHash)

  const stashAccounts = {}
  const stashKeys = await api.query.phalaModule.stashState.keysAt(blockHash)
  const stashCount = stashKeys.length
  await Promise.all(
    (stashKeys)
      .map(async k => {
        const stash = k.args[0].toString()
        const value = (await api.rpc.state.getStorage(k, blockHash)).toJSON()
        stashAccounts[stash] = {
          controller: value.controller,
          payout: value.payoutPrefs.target,
          commission: value.payoutPrefs.commission,
          stake: 0,
          workerStake: 0,
          userStake: 0,
          stakeAccountNum: 0,
          overallScore: 0,
          onlineStatus: false
        }
      }))

  const payoutAccounts = {}
  await Promise.all(
    (await api.query.phalaModule.fire2.keysAt(blockHash))
      .map(async k => {
        const account = k.args[0].toString()
        const value = await api.rpc.state.getStorage(k, blockHash)
        const fire2 = value.toString()
        payoutAccounts[account] = {
          ...payoutAccounts[account],
          account,
          fire2,
          fire2Human: value.toHuman().replace(/PHA$/, '').replace(' ', ''),
          workerCount: 0,
          payoutComputeReward: 0
        }
      }))

  await Promise.all(
    (await api.query.phalaModule.payoutComputeReward.keysAt(blockHash))
      .map(async k => {
        const account = k.args[0].toString()
        const value = await api.rpc.state.getStorage(k, blockHash)
        const payoutComputeReward = value.toNumber() || 0

        if (!payoutAccounts[account]) { return }
        payoutAccounts[account] = {
          ...payoutAccounts[account],
          payoutComputeReward
        }
      })
  )

  const validStashAccounts = {}
  let accumulatedScore = 0
  await Promise.all(
    (await api.query.phalaModule.workerState.keysAt(blockHash))
      .map(async k => {
        const stash = k.args[0].toString()
        const payout = stashAccounts[stash].payout
        const value = (await api.rpc.state.getStorage(k, blockHash)).toJSON()
        stashAccounts[stash].overallScore = value.score.overallScore

        if (typeof value.state.mining === 'undefined') { return }
        stashAccounts[stash].onlineStatus = true
        accumulatedScore += value.score.overallScore

        validStashAccounts[stash] = stashAccounts[stash]

        if (payoutAccounts[payout]) {
          payoutAccounts[payout] = {
            ...payoutAccounts[payout],
            workerCount: payoutAccounts[payout].workerCount + 1
          }
        }
      }))

  let accumulatedStake = undefined  
  await Promise.all(
    (await api.query.miningStaking.stakeReceived.keysAt(blockHash))
      .map(async k => {
        const stash = k.args[0].toString()
        const stashAccount = stashAccounts[stash]

        if (!stashAccount) { return }

        // const value = (await api.rpc.state.getStorage(k, blockHash)).div(ONE_THOUSAND)
        const value = (await api.rpc.state.getStorage(k, blockHash))
        accumulatedStake = typeof accumulatedStake === 'undefined'
          ? value : accumulatedStake.add(value)

        const payout = stashAccount.payout
        const payoutAccount = payoutAccounts[payout]

        if (!payoutAccount) { return }
        if (!value) { return }

        stashAccount.stake = value.add(stashAccount.stake  || ZERO)
        payoutAccount.stake = value.add(payoutAccount.stake || ZERO)
      })
  )

  await Promise.all(
    (await api.query.miningStaking.staked.keysAt(blockHash))
    .map(async k => {   
        const from = k.args[0].toString()
        const to = k.args[1].toString()     
        const value = (await api.rpc.state.getStorage(k, blockHash))

        const stash = to.toString()
        const stashAccount = stashAccounts[stash]

        if (!stashAccount) { return }

        stashAccount.stakeAccountNum = stashAccount.stakeAccountNum? (stashAccount.stakeAccountNum + 1): 1;

        if (from.toString() === to.toString()) {
          stashAccount.workerStake = value.add(stashAccount.workerStake  || ZERO)
        } else {
          stashAccount.userStake = value.add(stashAccount.userStake  || ZERO)
        }
      })
  )

  accumulatedStake = accumulatedStake || new BN('0')
  const accumulatedStakeDecimal = new Decimal(accumulatedStake.toString())
  Object.entries(payoutAccounts).forEach(([k, v]) => {
    const value = payoutAccounts[k].stake || new BN('0')
    const valueDecimal = new Decimal(value.toString())

    payoutAccounts[k].stake = value.toString()
    payoutAccounts[k].stakeHuman = api.createType('BalanceOf', payoutAccounts[k].stake).toHuman().replace(/PHA$/, '').replace(' ', '').trim()
    payoutAccounts[k].stakeRatio = valueDecimal.div(accumulatedStakeDecimal).toNumber()
  })

  const avgStakeDecimal = accumulatedStakeDecimal.div(stashCount)
  const avgStake = avgStakeDecimal
    .div(1000)
    .div(1000)
    .div(1000)
    .div(1000)
  
  const avgReward = accumulatedFire2Decimal.div(stashCount)
    .div(1000)
    .div(1000)
    .div(1000)
    .div(1000);

  const accumulatedFire2PHA = accumulatedFire2Decimal
    .div(1000)
    .div(1000)
    .div(1000)
    .div(1000)

  const stakeSum = accumulatedStakeDecimal
    .div(1000)
    .div(1000)
    .div(1000)
    .div(1000);

  const stakeSupplyRate = async function(stakeSumPHA) {
    const tokeninfo = await getTokenInfo()
    const available_supply = tokeninfo.available_supply
    if (0 === available_supply) {
      return 0
    }
    
    return stakeSumPHA.div(available_supply)
  }

  let workers = []
  Object.keys(stashAccounts).map(function(key, index) {
    const value = stashAccounts[key];
    const accumulatedStake = new Decimal(value.stake.toString())
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)

    const workerStake = new Decimal(value.workerStake.toString())
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)

    const userStake = new Decimal(value.userStake.toString())
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)

    workers.push({
      stash_account: key,
      controller_account: value.controller,
      payout: value.payout,
      online_status: value.onlineStatus,
      accumulated_stake: accumulatedStake,
      worker_stake: workerStake,
      user_stake: userStake,
      stake_account_num: value.stakeAccountNum,
      commission: value.commission,
      task_score: value.overallScore  + 5 * Math.sqrt(value.overallScore) ,
      machine_score: value.overallScore,
      online_reward: 1021,   //todo 等待后端合约完善
      compute_reward: 22,    //todo 等待后端合约完善
      reward: 12345,        //todo 等待后端合约完善
      apy: 1,            //todo@@ 根据mongodb历史数据完善 看看产品更新公式
      penalty: 0 // todo 等待后端合约完善
    });
  });

  async function getLastRoundReward(roundNum) {
    const historyRoundInfo = await HistoryRoundInfo.findOne({round: roundNum - 1});
    if (!historyRoundInfo) {
      return 0;
    }
    return historyRoundInfo.accumulatedFire2;
  }

  //jsonOutput = JSON.stringify(output)
  let realtimeRoundInfo = await RealtimeRoundInfo.findOne({});
  if (!realtimeRoundInfo) {
    realtimeRoundInfo = new RealtimeRoundInfo({
      round: roundNumber,
      avg_stake: avgStake,
      avg_reward: avgReward,
      accumulated_fire2: accumulatedFire2PHA,
      round_cycle_time: ROUND_CYCLE_TIME, //use 1 hour this time
      online_worker_num: onlineWorkers,
      worker_num: stashCount,
      stake_sum: stakeSum, 
      stake_supply_rate: await stakeSupplyRate(stakeSum),
      reward_last_round: await getLastRoundReward(roundNumber),
      blocktime: null,
      workers: workers
    });
  } else {
    realtimeRoundInfo.set({
      round: roundNumber,
      avg_stake: avgStake,
      avg_reward: avgReward,
      accumulated_fire2: accumulatedFire2PHA,
      round_cycle_time: ROUND_CYCLE_TIME, //use 1 hour this time
      online_worker_num: onlineWorkers,
      worker_num: stashCount,
      stake_sum: stakeSum, 
      stake_supply_rate: await stakeSupplyRate(stakeSum),
      reward_last_round: await getLastRoundReward(roundNumber),
      blocktime: null,
      workers: workers
    });
  }

  await realtimeRoundInfo.save();

  jsonOutput = JSON.stringify(realtimeRoundInfo)

  logger.info(`@@@ realtime Updated output from round #${roundNumber}. blocknum#${number}`)
}


export const init = async()=> {
  return
}

export default {init, main};
