import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node } from '../config/index.js'
import { Status } from '../lib/models/status.js'
import { HistoryRoundInfo } from '../lib/models/historyRoundInfo.js'
import { getTokenInfo } from '../servers/tokeninfo.js'
import { logger } from '../lib/utils/log.js'

const { default: Queue } = pQueue

const ONE_THOUSAND = new BN('1000', 10)
const ZERO = new BN('0')
const DEFAULT_OUTPUT = 'null'
const BLOCK_FIRST_ROUND_START = 1
const FIRST_SCAN_QUEUE_NUMBER = 1
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
        this.lastBlockHeader = null
        this.status = null
    }

    main = async () => {
        const provider = new WsProvider(node.WS_ENDPOINT)
        const api = await ApiPromise.create({ provider, types })

        const [phalaChain, phalaNodeName, phalaNodeVersion] = (await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version()
        ])).map(i => i.toString())

        return api.rpc.chain.subscribeFinalizedHeads(async header => {
            const number = header.number.toNumber()

            const status = await Status.findOne({})
            // 批量处理5个，小于5个先返回
            if (number <= status.lastScanQueueNumber + BATCH_MIN_SIZE) {
                return
            }

            logger.info(`history batch to queue  from #${status.lastScanQueueNumber}  to blocknum #${number}...`)
            for (let n = status.lastScanQueueNumber; n < number; n++) {
                queue.add(() => this.processBlockAt(n, api))
            }

            await Status.findOneAndUpdate({}, {
                lastScanQueueNumber: number
            })
        })
    }

    processBlockAt = async (blockNumber, api) => {
        const lastBlockHeaderHash = await api.rpc.chain.getBlockHash(blockNumber)
        this.lastBlockHeader = await api.rpc.chain.getHeader(lastBlockHeaderHash)

        await this.processRoundAt(this.lastBlockHeader, api).catch(console.error)
    }

    processBlock = async (api) => {
        const blockNumber = this.status.lastScanNumber + 1
        const lastBlockHeaderHash = await api.rpc.chain.getBlockHash(blockNumber)
        this.lastBlockHeader = await api.rpc.chain.getHeader(lastBlockHeaderHash)

        return queue.add(() => this.processRoundAt(this.lastBlockHeader, api).catch(console.error))
    }

    processRoundAt = async (header, api) => {
        const blockHash = header.hash

        const roundInfo = (await api.query.phala.round.at(blockHash)) || new BN('0')
        const roundNumber = roundInfo.round.toNumber()
        const number = header.number.toNumber()
        const timestamp = await api.query.timestamp.now.at(blockHash)
        logger.info(`history block round #${roundNumber} blocknum#${number}...`)

        const accumulatedFire2 = (await api.query.phala.accumulatedFire2.at(blockHash)) || new BN('0')
        const accumulatedFire2Decimal = new Decimal(accumulatedFire2.toString())
        const onlineWorkers = await api.query.phala.onlineWorkers.at(blockHash)

        const stashAccounts = {}
        const stashKeys = await api.query.phala.stashState.keysAt(blockHash)
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
                        onlineReward: 0,
                        computeReward: 0,
                        slash: 0
                    }
                }))

        const payoutAccounts = {}
        await Promise.all(
            (await api.query.phala.fire2.keysAt(blockHash))
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

        const validStashAccounts = {}
        let accumulatedScore = 0
        await Promise.all(
            (await api.query.phala.workerState.keysAt(blockHash))
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

        await Promise.all(
            (await api.query.phala.roundWorkerStats.keysAt(blockHash))
                .map(async k => {
                    const stash = k.args[0].toString()
                    const value = (await api.rpc.state.getStorage(k, blockHash)).toJSON()

                    const slashDecimal = new Decimal(value.slash)
                    const computeReceivedDecimal = new Decimal(value.compute_received)
                    const onlineReceivedDecimal = new Decimal(value.online_received)

                    stashAccounts[stash].slash = slashDecimal.div(1000)
                        .div(1000)
                        .div(1000)
                        .div(1000)

                    stashAccounts[stash].computeReward = computeReceivedDecimal.div(1000)
                        .div(1000)
                        .div(1000)
                        .div(1000)

                    stashAccounts[stash].onlineReward = onlineReceivedDecimal.div(1000)
                        .div(1000)
                        .div(1000)
                        .div(1000)
                }))

        let accumulatedStake
        await Promise.all(
            (await api.query.miningStaking.stakeReceived.keysAt(blockHash))
                .map(async k => {
                    const stash = k.args[0].toString()
                    const stashAccount = stashAccounts[stash]

                    if (!stashAccount) { return }

                    const value = (await api.rpc.state.getStorage(k, blockHash)).unwrapOrDefault()
                    accumulatedStake = typeof accumulatedStake === 'undefined'
                        ? value
                        : accumulatedStake.add(value)

                    const payout = stashAccount.payout
                    const payoutAccount = payoutAccounts[payout]

                    if (!payoutAccount) { return }
                    if (!value) { return }

                    stashAccount.stake = value.add(stashAccount.stake || ZERO)
                    payoutAccount.stake = value.add(payoutAccount.stake || ZERO)
                })
        )

        await Promise.all(
            (await api.query.miningStaking.staked.keysAt(blockHash))
                .map(async k => {
                    const from = k.args[0].toString()
                    const to = k.args[1].toString()
                    const value = (await api.rpc.state.getStorage(k, blockHash)).unwrapOrDefault()

                    const stash = to.toString()
                    const stashAccount = stashAccounts[stash]

                    if (!stashAccount) { return }

                    stashAccount.stakeAccountNum = stashAccount.stakeAccountNum ? (stashAccount.stakeAccountNum + 1) : 1

                    if (from.toString() === to.toString()) {
                        stashAccount.workerStake = value.add(stashAccount.workerStake || ZERO)
                    } else {
                        stashAccount.userStake = value.add(stashAccount.userStake || ZERO)
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
            .div(1000)

        const accumulatedFire2PHA = accumulatedFire2Decimal
            .div(1000)
            .div(1000)
            .div(1000)
            .div(1000)

        const stakeSum = accumulatedStakeDecimal
            .div(1000)
            .div(1000)
            .div(1000)
            .div(1000)

        const stakeSupplyRate = async function (stakeSumPHA) {
            const tokeninfo = await getTokenInfo()
            const availableSupply = tokeninfo.availableSupply
            if (availableSupply === 0) {
                return 0
            }

            return stakeSumPHA.div(availableSupply)
        }

        const getApyCurrentRound = function (accumulatedFire2PHA, stakeSumOfUserStake) {
            if (stakeSumOfUserStake === 0) {
                return 0
            }
            if (accumulatedFire2PHA === 0) {
                return 0
            }

            return accumulatedFire2PHA / stakeSumOfUserStake * 24 * 365 * 100
        }

        const workers = []
        Object.keys(stashAccounts).map(function (key, index) {
            const value = stashAccounts[key]
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

            const reward = (new Decimal(value.onlineReward)).plus(new Decimal(value.computeReward)).minus(new Decimal(value.slash))

            function getApy(reward, userStake) {
                if (userStake.isZero()) {
                    return 0
                }
                return reward / userStake * 24 * 365 * 100  //增加100倍数，方便保存和传输 10表示10%
            }

            workers.push({
                stashAccount: key,
                controllerAccount: value.controller,
                payout: value.payout,
                accumulatedStake: accumulatedStake,
                workerStake: workerStake,
                userStake: userStake.toNumber(),
                stakeAccountNum: value.stakeAccountNum,
                commission: value.commission,
                taskScore: value.overallScore + 5 * Math.sqrt(value.overallScore),
                machineScore: value.overallScore,
                onlineReward: value.onlineReward,
                computeReward: value.computeReward,
                reward: reward,
                apy: getApy(reward, userStake),
                penalty: value.slash
            })

            return stashAccounts[key]
        })

        const stakeSumOfUserStake = workers.map(x => x.userStake).reduce((a, b) => a + b, 0)
        // jsonOutput = JSON.stringify(output)
        const historyData = {
            round: roundNumber,
            avgStake: avgStake,
            avgReward: avgReward,
            accumulatedFire2: accumulatedFire2PHA, // 总奖励
            cycleTime: ROUND_CYCLE_TIME, // use 1 hour this time
            onlineWorkerNum: onlineWorkers.toNumber(),
            workerNum: stashCount,
            stakeSum: stakeSum,
            stakeSupplyRate: await stakeSupplyRate(stakeSum),
            startedAt: new Date(timestamp.toNumber()),
            blockNum: number,
            workers: workers,
            apyCurrentRound: getApyCurrentRound(accumulatedFire2PHA, stakeSumOfUserStake)
        }

        mongoWriteQueue.add(() => this.writeDatebase(roundNumber, number, historyData))
    }

    writeDatebase = async (roundNumber, blockNumber, historyData) => {
        let historyRoundInfo = await HistoryRoundInfo.findOne({
            round: roundNumber
        })

        if (!historyRoundInfo) {
            historyRoundInfo = new HistoryRoundInfo(historyData)
            await historyRoundInfo.save()
        } else {
            if (historyData.blockNum > historyRoundInfo.blockNum) {
                const prop = 'startedAt'
                const newHistoryData = Object.keys(historyData).reduce((object, key) => {
                    if (key !== prop) {
                        object[key] = historyData[key]
                    }
                    return object
                }, {})

                await HistoryRoundInfo.updateOne({
                    round: roundNumber
                }, newHistoryData)
            }
        }

        await Status.findOneAndUpdate({}, {
            lastScanNumber: blockNumber,
            lastScanRound: roundNumber
        })

        logger.info(`### history insert Updated output from round #${roundNumber}. in blocknum #${blockNumber}`)
    }

    init = async () => {
        let _status = await Status.findOne({})
        if (!_status) {
            _status = new Status({
                headBlockNumber: 0,
                time: null,
                headBlockId: '',

                lastScanQueueNumber: FIRST_SCAN_QUEUE_NUMBER,
                lastScanNumber: BLOCK_FIRST_ROUND_START,
                lastScanRound: 0,
                lastScanTime: null
            })
            await _status.save()
        } else {
            if (_status.lastScanQueueNumber > _status.lastScanNumber) {
                const newLastScanQueueNumber = _status.lastScanNumber - BATCH_MIN_SIZE >= BLOCK_FIRST_ROUND_START ? _status.lastScanNumber - BATCH_MIN_SIZE : BLOCK_FIRST_ROUND_START
                _status.set({
                    lastScanQueueNumber: newLastScanQueueNumber
                })

                await _status.save()
            }
        }
        this.status = _status
    }
}

export default BlocksHistoryScan
