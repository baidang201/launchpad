import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node }  from '../config/index.js'
import { Status } from '../lib/models/status.js'
import { HistoryRoundInfo } from '../lib/models/historyRoundInfo.js'
import { getTokenInfo } from '../servers/tokeninfo.js'
import {logger} from '../lib/utils/log.js'

const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const DEFAULT_OUTPUT = 'null'
const BLOCK_FIRST_ROUND_START = 1000000
const FIRST_SCAN_QUEUE_NUMBER = 1000000
const ROUND_CYCLE_TIME = 3600
const BATCH_MIN_SIZE = 4

const queue = new Queue({
  timeout: 90000,
  throwOnTimeout: false,
  concurrency: BATCH_MIN_SIZE
})

const mongoWriteQueue = new Queue({
  timeout: 90000,
  throwOnTimeout: false,
  concurrency: 1
})

class BlocksHistoryScan {
  constructor(opts, wsRpc) {
    this.lastBlockHeader = null;
    this.status = null;
  }

  main = async () => {
    const provider = new WsProvider(node.WS_ENDPOINT)
    const api = await ApiPromise.create({ provider, types })

    const [phalaChain, phalaNodeName, phalaNodeVersion] = (await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ])).map(i => i.toString());

    return api.rpc.chain.subscribeFinalizedHeads(async header => {
      const number = header.number.toNumber()

      const status = await Status.findOne({});
      //批量处理5个，小于5个先返回
      if (number <= status.last_scan_queue_number + BATCH_MIN_SIZE) {
        return
      }
  
      logger.info(`history batch to queue  from #${status.last_scan_queue_number}  to blocknum #${number}...`)
      for (let n = status.last_scan_queue_number; n < number; n++) {
        queue.add(() => this.processBlockAt(n, api))
      }

      await Status.findOneAndUpdate({}, {
        last_scan_queue_number: number,
      })
    })
  }

  processBlockAt = async (blockNumber, api) => {
    const lastBlockHeaderHash = await api.rpc.chain.getBlockHash(blockNumber)
    this.lastBlockHeader = await api.rpc.chain.getHeader(lastBlockHeaderHash)
    
    await this.processRoundAt(this.lastBlockHeader, api).catch(console.error)
  }

  processBlock = async (api) => {
    const blockNumber = this.status.last_scan_number + 1;
    const lastBlockHeaderHash = await api.rpc.chain.getBlockHash(blockNumber)
    this.lastBlockHeader = await api.rpc.chain.getHeader(lastBlockHeaderHash)
    
    return queue.add(() => this.processRoundAt(this.lastBlockHeader, api).catch(console.error))
  }

  processRoundAt = async (header, api) => {
    const blockHash = header.hash

    const roundInfo = (await api.query.phalaModule.round.at(blockHash)) || new BN('0')
    const roundNumber = roundInfo.round.toNumber()
    const number = header.number.toNumber()
    logger.info(`history block round #${roundNumber} blocknum#${number}...`)

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
          overallScore: 0
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
            prizeRatio: new Decimal(fire2).div(accumulatedFire2Decimal).toNumber(),
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

          if (typeof value.state.Mining === 'undefined') { return }
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

    const getApyCurrentRound = function(accumulatedFire2PHA, stakeSumOfUserStake) {
      if (0 === stakeSumOfUserStake) {
        return 0;
      }
      if (0 === accumulatedFire2PHA) {
        return 0;
      }

      return accumulatedFire2PHA/stakeSumOfUserStake*24*365;
    }

    let workers = []
    Object.keys(stashAccounts).map(function(key, index) {
      let value = stashAccounts[key];
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

      const reward = new Decimal(125);//todo 等待后端合约完善

      function getApy(reward, userStake) {
        if (userStake.isZero()) {
          return 0
        }
        return reward/userStake*24*365
      }

      workers.push({
        stash_account: key,
        controller_account: value.controller,
        payout: value.payout,
        accumulated_stake: accumulatedStake,
        worker_stake: workerStake,
        user_stake: userStake.toNumber(),
        stake_account_num: value.stakeAccountNum,
        commission: value.commission,
        task_score: value.overallScore  + 5 * Math.sqrt(value.overallScore) ,
        machine_score: value.overallScore,
        online_reward: 1021,   //todo 等待后端合约完善
        compute_reward: 22,    //todo 等待后端合约完善
        reward: reward,        //todo 等待后端合约完善
        apy: getApy(reward, userStake),
        penalty: 0 // todo 等待后端合约完善
      });
    });

    const stakeSumOfUserStake = workers.map(x => x.user_stake).reduce((a, b) => a + b, 0)
    //jsonOutput = JSON.stringify(output)
    const historyData = {
      round: roundNumber,
      avg_stake: avgStake,
      avg_reward: avgReward,
      accumulated_fire2: accumulatedFire2PHA, //总奖励
      round_cycle_time: ROUND_CYCLE_TIME, //use 1 hour this time
      online_worker_num: onlineWorkers,
      worker_num: stashCount,
      stake_sum: stakeSum, 
      stake_supply_rate: await stakeSupplyRate(stakeSum),
      blocktime: null,
      block_num: number,
      workers: workers,
      apy_current_round: getApyCurrentRound(accumulatedFire2PHA, stakeSumOfUserStake),
    };

    mongoWriteQueue.add(() => this.writeDatebase(roundNumber, number, historyData))
  }

  writeDatebase = async(roundNumber, blockNumber, historyData) => {
    let historyRoundInfo = await HistoryRoundInfo.findOne({
      round: roundNumber
    });

    if (!historyRoundInfo) {
      historyRoundInfo = new HistoryRoundInfo(historyData);
      await historyRoundInfo.save();
    } else {
      if (historyData.block_num > historyRoundInfo.block_num) {
        await HistoryRoundInfo.updateOne({
          round: roundNumber
        }, historyData);
      }
    }

    await Status.findOneAndUpdate({}, {
      last_scan_number: blockNumber,
      last_scan_round: roundNumber
    })

    logger.info(`### history insert Updated output from round #${roundNumber}. in blocknum #${blockNumber}`)
  }

  init = async()=> {
    let _status = await Status.findOne({});
    if (!_status) {
        _status = new Status({
            head_block_number: 0,
            time: null,
            head_block_id: "",

            last_scan_queue_number: FIRST_SCAN_QUEUE_NUMBER,
            last_scan_number: BLOCK_FIRST_ROUND_START,
            last_scan_round: 0,
            last_scan_time: null
        });
        await _status.save();
    } else {
      if (_status.last_scan_queue_number > _status.last_scan_number) {

        const new_last_scan_queue_number = _status.last_scan_number - BATCH_MIN_SIZE >= BLOCK_FIRST_ROUND_START? _status.last_scan_number - BATCH_MIN_SIZE : BLOCK_FIRST_ROUND_START 
        _status.set({
          last_scan_queue_number: new_last_scan_queue_number,
        })

        await _status.save();
      }
    }
    this.status = _status;
  }
}

export default BlocksHistoryScan;