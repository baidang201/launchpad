import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Demical from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node }  from '../config/index.js'
import { Status } from '../lib/models/status.js'
import { HistoryRoundInfo } from '../lib/models/historyRoundInfo.js'
import { createLogger } from 'bunyan'
import { getTokenInfo } from '../servers/tokeninfo.js'

const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const DEFAULT_OUTPUT = 'null'
const BLOCK_FIRST_ROUND_START = 1046196
const defaultLoopBlocksTime = 1000
const ROUND_CYCLE_TIME = 3600

const queue = new Queue({
  timeout: 90000,
  throwOnTimeout: false,
  concurrency: 1
})

globalThis.$logger = createLogger({
  level: 'info',
  name: 'dashboard'
})

let jsonOutput = DEFAULT_OUTPUT

class BlocksHistoryScan {
  constructor(opts, wsRpc) {
    this.defaultLoopBlocksTime = 1000;//默认区块扫描间隔时间，1000
    this.lastBlockHeader = null;
    this.status = null;
  }

  main = async () => {
    const provider = new WsProvider(node.WS_ENDPOINT)
    const api = await ApiPromise.create({ provider, types })
    globalThis.api = api

    const [phalaChain, phalaNodeName, phalaNodeVersion] = (await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ])).map(i => i.toString());

    const that = this;
    (function iteratorBlocks() {
      that.processBlock(api).then((nextTimeout) => {
          nextTimeout = nextTimeout || defaultLoopBlocksTime;
          setTimeout(() => {
              iteratorBlocks();
          }, nextTimeout)
      }).catch((err) => {
          console.log("iteratorBlocks error: " + new Date().toString());
          console.log(err);
          let nextTimeout = defaultLoopBlocksTime;
          setTimeout(() => {
              iteratorBlocks();
          }, nextTimeout)
      })
    })();
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
    const accumulatedFire2 = (await api.query.phalaModule.accumulatedFire2.at(blockHash)) || new BN('0')
    const accumulatedFire2Demical = new Demical(accumulatedFire2.toString())
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
            prizeRatio: new Demical(fire2).div(accumulatedFire2Demical).toNumber(),
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
    const accumulatedStakeDemical = new Demical(accumulatedStake.toString())
    Object.entries(payoutAccounts).forEach(([k, v]) => {
      const value = payoutAccounts[k].stake || new BN('0')
      const valueDemical = new Demical(value.toString())

      payoutAccounts[k].stake = value.toString()
      payoutAccounts[k].stakeHuman = api.createType('BalanceOf', payoutAccounts[k].stake).toHuman().replace(/PHA$/, '').replace(' ', '').trim()
      payoutAccounts[k].stakeRatio = valueDemical.div(accumulatedStakeDemical).toNumber()
    })

    const avgStakeDemical = accumulatedStakeDemical.div(stashCount)
    const avgStake = avgStakeDemical
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)

    const avgReward = accumulatedFire2Demical.div(stashCount)
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000);

    const accumulatedFire2PHA = accumulatedFire2Demical
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)

    const stakeSum = accumulatedStakeDemical
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
      
      return stakeSum.div(available_supply)
    }

    const getApyCurrentRound = function(accumulatedFire2PHA, stakeSumOfUserStake) {
      if (0 == stakeSumOfUserStake) {
        return 0;
      }

      return accumulatedFire2PHA/stakeSumOfUserStake*24*365;
    }

    let workers = []
    Object.keys(stashAccounts).map(function(key, index) {
      let value = stashAccounts[key];
      const accumulatedStake = new Demical(value.stake.toString())
        .div(1000)
        .div(1000)
        .div(1000)
        .div(1000)

      const workerStake = new Demical(value.workerStake.toString())
        .div(1000)
        .div(1000)
        .div(1000)
        .div(1000)

      const userStake = new Demical(value.userStake.toString())
        .div(1000)
        .div(1000)
        .div(1000)
        .div(1000)

      const reward = new Demical(125);//todo 等待后端合约完善

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
        user_stake: userStake,
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
    let historyRoundInfo = await HistoryRoundInfo.findOne({
      round: roundNumber
    });
    if (!historyRoundInfo) {
      historyRoundInfo = new HistoryRoundInfo({
        round: roundNumber,
        avg_stake: avgStake,
        avg_reward: avgReward,
        accumulated_fire2: accumulatedFire2PHA, //总奖励
        round_cycle_time: ROUND_CYCLE_TIME, //use 1 hour this time
        online_worker_num: onlineWorkers,
        worker_num: stashCount,
        stake_sum: stakeSum, 
        stake_supply_rate: await stakeSupplyRate(),
        blocktime: null,
        workers: workers,
        apy_current_round: getApyCurrentRound(accumulatedFire2PHA, stakeSumOfUserStake),
      });
    } else {
      historyRoundInfo.set({
        round: roundNumber,
        avg_stake: avgStake,
        avg_reward: avgReward,
        accumulated_fire2: accumulatedFire2PHA,
        round_cycle_time: ROUND_CYCLE_TIME, //use 1 hour this time
        online_worker_num: onlineWorkers,
        worker_num: stashCount,
        stake_sum: stakeSum, 
        stake_supply_rate: await stakeSupplyRate(),
        blocktime: null,
        workers: workers,
        apy_current_round: getApyCurrentRound(accumulatedFire2PHA, stakeSumOfUserStake),
      });
    }

    await historyRoundInfo.save();

    this.status.set({
      last_scan_number: number,
      last_scan_round: roundNumber
    })
    await this.status.save();
  }


  init = async()=> {
    let _status = await Status.findOne({});
    if (!_status) {
        _status = new Status({
            head_block_number: 0,
            time: null,
            head_block_id: "",

            last_scan_number: BLOCK_FIRST_ROUND_START,
            last_scan_round: 0,
            last_scan_time: null
        });
        await _status.save();
    }
    this.status = _status;
  }
}

export default BlocksHistoryScan;