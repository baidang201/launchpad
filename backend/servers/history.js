import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Demical from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node }  from '../config/index.js'
import { Status } from '../models/status.js'
import { HistoryRoundInfo } from '../models/historyRoundInfo.js'
import { createLogger } from 'bunyan'

const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const DEFAULT_OUTPUT = 'null'
const BLOCK_FIRST_ROUND_START = 1046196
const defaultLoopBlocksTime = 1000

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

    //console.log({ chain: phalaChain }, `Connected to chain ${phalaChain} using ${phalaNodeName} v${phalaNodeVersion}`)

    let that = this;
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
    console.log("#### in processBlock");
    console.log("#start status", this.status);

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

    console.log("#get roundNumber", roundNumber);
    console.log("####1 stashAccounts");
    await Promise.all(
      (stashKeys)
        .map(async k => {
          const stash = k.args[0].toString()
          const value = (await api.rpc.state.getStorage(k, blockHash)).toJSON()
          stashAccounts[stash] = {
            controller: value.controller,
            payout: value.payoutPrefs.target
          }
        }))

    const payoutAccounts = {}
    console.log("####2 payoutAccounts");
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

    console.log("####3 payoutComputeReward");
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

    console.log("####4 workerState");
    const validStashAccounts = {}
    let accumulatedScore = 0
    await Promise.all(
      (await api.query.phalaModule.workerState.keysAt(blockHash))
        .map(async k => {
          const stash = k.args[0].toString()
          const payout = stashAccounts[stash].payout
          const value = (await api.rpc.state.getStorage(k, blockHash)).toJSON()

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

    console.log("####5 payoutAccount.stake");
    let accumulatedStake = undefined
    await Promise.all(
      (await api.query.miningStaking.stakeReceived.keysAt(blockHash))
        .map(async k => {
          const stash = k.args[0].toString()
          const stashAccount = validStashAccounts[stash]

          if (!stashAccount) { return }

          // const value = (await api.rpc.state.getStorage(k, blockHash)).div(ONE_THOUSAND)
          const value = (await api.rpc.state.getStorage(k, blockHash))
          accumulatedStake = typeof accumulatedStake === 'undefined'
            ? value : accumulatedStake.add(value)

          const payout = stashAccount.payout
          const payoutAccount = payoutAccounts[payout]

          if (!payoutAccount) { return }
          if (!value) { return }

          payoutAccount.stake = value.add(payoutAccount.stake || ZERO)
        })
    )

    console.log("####6 count stake");
    accumulatedStake = accumulatedStake || new BN('0')
    const accumulatedStakeDemical = new Demical(accumulatedStake.toString())
    Object.entries(payoutAccounts).forEach(([k, v]) => {
      const value = payoutAccounts[k].stake || new BN('0')
      const valueDemical = new Demical(value.toString())

      payoutAccounts[k].stake = value.toString()
      payoutAccounts[k].stakeHuman = api.createType('BalanceOf', payoutAccounts[k].stake).toHuman().replace(/PHA$/, '').replace(' ', '').trim()
      payoutAccounts[k].stakeRatio = valueDemical.div(accumulatedStakeDemical).toNumber()
    })

    console.log("####7 count stake reward");
    const avgStakeDemical = accumulatedStakeDemical.div(stashCount)
    const avgStake = avgStakeDemical
      .div(1000)
      .div(1000)
      .div(1000)
      .div(1000)
    
    const avgreward = accumulatedFire2Demical.div(stashCount);

    const output = {
      roundNumber,
      updatedAt: Date.now(),
      accumulatedFire2: accumulatedFire2.toString(),
      onlineWorkers: onlineWorkers.toString(),
      totalPower: totalPower.toString(),
      accumulatedStake: accumulatedStake.toString(),
      accumulatedStakeHuman: api.createType('BalanceOf', accumulatedStake).toHuman().replace(/PHA$/, '').replace(' ', '').trim(),
      stashAccounts: validStashAccounts,
      payoutAccounts,
      stashCount,
      avgStakeDemical,
      avgStake: parseFloat(avgStake),
      avgScore: accumulatedScore / onlineWorkers.toNumber()
    }

    let workers = []
    //for (var [key, value] of stashAccounts) {
    Object.keys(stashAccounts).map(function(key, index) {
      let value = stashAccounts[key];
      workers.push({
        stashAccount: key,
        controllerAccount: value.controller,
        payout: value.payout,
        accumulatedStake: "0",//bigNum?
        workerStake: "0",//bigNum?
        stakeAccountNum: 12,
        commission: 21.3,
        taskScore: 99,
        machineScore: 78,
        onlineReward: 1021,
        computeReward: 22,
        reward: 12345,
        apy: 12.3,
        apyprofit: 1111.3,
        penalty: 0
      });
    });

    //jsonOutput = JSON.stringify(output)
    let historyRoundInfo = await HistoryRoundInfo.findOne({
      round: roundNumber
    });
    if (!historyRoundInfo) {
      historyRoundInfo = new HistoryRoundInfo({
        round: roundNumber,
        avgStake: parseFloat(avgStake),
        avgreward: avgreward,
        accumulatedFire2: accumulatedFire2,
        blocktime: null,
        workers: workers
      });
    } else {
      console.log("#before insert", roundNumber, avgStake, accumulatedFire2.toString());
      historyRoundInfo.set({
        round: roundNumber,
        avgStake: parseFloat(avgStake),
        avgreward: avgreward,
        accumulatedFire2: accumulatedFire2,
        blocktime: null,
        workers: workers
      });
    }

    await historyRoundInfo.save();

    this.status.set({
      last_scan_number: number,
      last_scan_round: roundNumber
    })
    await this.status.save();
    console.log("#end status", number, this.status);
    //$logger.info(`Updated output from round #${roundNumber}.`)
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
    //console.log("status:" + JSON.stringify(this.status));
  }
}

export default BlocksHistoryScan;