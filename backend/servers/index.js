import pQueue from 'p-queue'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import types from '../typedefs.json'
import BN from 'bn.js'
import { node } from '../config/index.js'
import { RealtimeRoundInfo } from '../lib/models/realtimeRoundInfo.js'
import { HistoryRoundInfo } from '../lib/models/historyRoundInfo.js'
import { getTokenInfo } from '../servers/tokeninfo.js'
import { logger } from '../lib/utils/log.js'
import { workerConfig } from '../config/index.js'

const { default: Queue } = pQueue

const ZERO = new BN('0')
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

    const roundStartAt = 0
    const currentRound = 0

    const [phalaChain, phalaNodeName, phalaNodeVersion] = (await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ])).map(i => i.toString())
    logger.info({ chain: phalaChain }, `Connected to chain ${phalaChain} using ${phalaNodeName} v${phalaNodeVersion}`)

    return api.rpc.chain.subscribeFinalizedHeads(async header => {
        const number = header.number.toNumber()
        const roundInfo = (await api.query.phala.round.at(header.hash)) || new BN('0')
        const roundNumber = roundInfo.round.toNumber()

        logger.info(`realtime block round #${roundNumber} blocknum#${number}...`)

        return queue.add(() => processRoundAt(header, roundNumber, api).catch(console.error))
    })
}

const processRoundAt = async (header, roundNumber, api) => {
    const blockHash = header.hash
    const number = header.number.toNumber()
    const accumulatedFire2 = (await api.query.phala.accumulatedFire2.at(blockHash)) || new BN('0')
    const accumulatedFire2Decimal = new Decimal(accumulatedFire2.toString())
    const onlineWorkers = await api.query.phala.onlineWorkers.at(blockHash)

    const initialReward = new Decimal(129600000) // 129600000 PHA
    const decayInterval = new Decimal(180 * 24 * 60 * 60) // 180 days
    const roundInterval = new Decimal(60 * 60) // 1 hour
    const onlineRewardPercentage = await new Decimal(0.3) // rel: 37.5% post-taxed: 30%
    const computeRewardPercentage = await new Decimal(0.5) // rel: 62.5% post-taxed: 50%

    const roundReward = initialReward.div(decayInterval.div(roundInterval))
    const sumOfOnlineReward = roundReward.mul(onlineRewardPercentage)
    const sumOfComputeReward =  roundReward.mul(computeRewardPercentage)
    const targetVirtualTaskCount = await api.query.phala.targetVirtualTaskCount.at(blockHash)

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
                    onlineStatus: false,
                    status: '',
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
                accumulatedScore += value.score.overallScore

                stashAccounts[stash].status = Object.keys(value.state)[0]
                if (value.state.stakePending === undefined && value.state.miningPending === undefined && value.state.mining === undefined) { return }
                stashAccounts[stash].onlineStatus = true

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

    const sumOfScore = accumulatedScore
    const avgScore = new Decimal(accumulatedScore).div(stashCount)

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

        const reward = (new Decimal(value.onlineReward)).add(new Decimal(value.computeReward)).sub(new Decimal(value.slash))

        function winningRate({ score = 200, stake = 1000, miners = 500, avgScore = 420, avgStake = 1000, myMiners = 1 }) {
            const n = 5
            const weight = w(score, stake)
            const otherWeight = w(avgScore, avgStake)
            return p(weight, myMiners, otherWeight, miners, 1, n - myMiners)
        }

        function w(score, stake) {
            return score + Math.sqrt(stake) * 5
        }

        function p(a, m, b, n, x, y) {
            if (x === 0 && y === 0) return 1
            if (m === 0 || n === 0) return 1
            const sigma = a * m + b * n
            return (
                (x > 0 ? (a * m / sigma) * p(a, m - 1, b, n, x - 1, y) : 0) +
            (y > 0 ? (b * n / sigma) * p(a, m, b, n - 1, x, y - 1) : 0)
            )
        }

        function getApy({
            sumOfOnlineReward = new Decimal(0),
            sumOfComputeReward = new Decimal(0),
            sumOfScore = 0,
            commission = 0,
            targetVirtualTaskCount = 0,
            userStake = new Decimal(0),
            score = 0, 
            stake = 0, 
            miners = 0, 
            avgScore = 0, 
            avgStake = 0
        }) {
            if (0 === sumOfScore || 0 === score) {
                return 0
            }
            if (userStake.isZero()) {
                return 0
            }
            if (sumOfComputeReward.isZero()) {
                return 0
            }
            const onlineReward = sumOfOnlineReward.mul((score / sumOfScore)) 
            const computeReward = sumOfComputeReward.mul(winningRate({
                score, 
                stake, 
                miners, 
                avgScore, 
                avgStake
            }) ).div(  targetVirtualTaskCount.toNumber() )

            const newRate = (100 - commission) / 100
            const apy = onlineReward.add(computeReward).mul(newRate).mul(24 * 365).div(userStake).mul(100) //小数转为百分比 乘于100

            return apy
        }

        workers.push({
            stashAccount: key,
            controllerAccount: value.controller,
            payout: value.payout,
            onlineStatus: value.onlineStatus,
            status: value.status,
            accumulatedStake: accumulatedStake,
            workerStake: workerStake,
            userStake: userStake,
            stakeAccountNum: value.stakeAccountNum,
            commission: value.commission,
            taskScore: value.overallScore + 5 * Math.sqrt(value.overallScore),
            machineScore: value.overallScore,
            onlineReward: value.onlineReward,
            computeReward: value.computeReward,
            reward: reward,
            apy: getApy({
                sumOfOnlineReward,
                sumOfComputeReward,
                sumOfScore,
                commission: value.commission,
                targetVirtualTaskCount,
                userStake: userStake.isZero()? new Decimal(1): userStake,
                score: value.overallScore, 
                stake: accumulatedStake.toDecimalPlaces(0), 
                miners: parseInt(onlineWorkers), 
                avgScore: avgScore.toDecimalPlaces(0),
                avgStake: avgStake.toDecimalPlaces(0)
            }), 
            stakeToMinApy: getApy({
                sumOfOnlineReward,
                sumOfComputeReward,
                sumOfScore,
                commission: value.commission,
                targetVirtualTaskCount,
                userStake: userStake.isZero()? new Decimal(1): userStake,
                score: value.overallScore, 
                stake: workerConfig.BASE_STAKE_PHA, 
                miners: parseInt(onlineWorkers), 
                avgScore: avgScore.toDecimalPlaces(0),
                avgStake: avgStake.toDecimalPlaces(0)
            }), 
            penalty: value.slash
        })

        return stashAccounts[key]
    })

    async function getLastRoundReward(roundNum) {
        const historyRoundInfo = await HistoryRoundInfo.findOne({ round: roundNum - 1 })
        if (!historyRoundInfo) {
            return 0
        }
        return historyRoundInfo.accumulatedFire2
    }

    // jsonOutput = JSON.stringify(output)
    let realtimeRoundInfo = await RealtimeRoundInfo.findOne({})
    if (!realtimeRoundInfo) {
        realtimeRoundInfo = new RealtimeRoundInfo({
            round: roundNumber,
            avgStake: avgStake,
            avgReward: avgReward,
            accumulatedFire2: accumulatedFire2PHA,
            cycleTime: ROUND_CYCLE_TIME, // use 1 hour this time
            onlineWorkerNum: onlineWorkers.toNumber(),
            workerNum: stashCount,
            stakeSum: stakeSum,
            stakeSupplyRate: await stakeSupplyRate(stakeSum),
            rewardLastRound: await getLastRoundReward(roundNumber),
            startedAt: null,
            workers: workers
        })
    } else {
        realtimeRoundInfo.set({
            round: roundNumber,
            avgStake: avgStake,
            avgReward: avgReward,
            accumulatedFire2: accumulatedFire2PHA,
            cycleTime: ROUND_CYCLE_TIME, // use 1 hour this time
            onlineWorkerNum: onlineWorkers.toNumber(),
            workerNum: stashCount,
            stakeSum: stakeSum,
            stakeSupplyRate: await stakeSupplyRate(stakeSum),
            rewardLastRound: await getLastRoundReward(roundNumber),
            startedAt: null,
            workers: workers
        })
    }

    await realtimeRoundInfo.save()

    jsonOutput = JSON.stringify(realtimeRoundInfo)

    logger.info(`@@@ realtime Updated output from round #${roundNumber}. blocknum#${number}`)
}

export const init = async () => {

}

export default { init, main }
