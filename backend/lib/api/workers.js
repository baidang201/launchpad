
import { RealtimeRoundInfo } from '../models/realtimeRoundInfo.js'
import { HistoryRoundInfo } from '../models/historyRoundInfo.js'
import protobuf from '../protobuf/protobuf.js'

const BASE_STAKE_PHA = 1620
const COMMISSION_LIMIT = 20

function paginate(array, pageSize, pageNumber) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

export async function getWorkers(workerRequest) {
    const offset = (workerRequest.page - 1) * workerRequest.pageSize

    const filterList = []
    filterList.push({ $unwind: '$workers' })
    if (workerRequest.filterRuning) {
        filterList.push({ $match: { 'workers.onlineStatus': true } })
    }
    if (workerRequest.filterStakeLessThan) {
        filterList.push({ $match: { 'workers.workerStake': { $lt: BASE_STAKE_PHA } } })
    }
    if (workerRequest.filterCommissionLessThan) {
        filterList.push({ $match: { 'workers.commission': { $lte: COMMISSION_LIMIT } } })
    }
    if (workerRequest.filterStashAccounts) {
        filterList.push({ $match: { 'workers.stashAccount': { $in: workerRequest.filterStashAccounts } } })
    }

    const total = (await RealtimeRoundInfo.aggregate(filterList)).length

    if (workerRequest.sortFieldName) {
        const key = 'workers.' + workerRequest.sortFieldName
        const orderNum = workerRequest.sortAsc ? 1 : -1

        filterList.push({ $sort: { [key]: orderNum } })
    } else {
        filterList.push({ $sort: { 'workers.apy': -1 } })
    }

    filterList.push({ $skip: offset })
    filterList.push({ $limit: workerRequest.pageSize })

    const filterWorkers = await RealtimeRoundInfo.aggregate(filterList)

    if (!filterWorkers) {
        const message = protobuf.WorkerResponse.create({ status: { success: -1, msg: 'can not find data in database' } })
        const buffer = protobuf.WorkerResponse.encode(message).finish()
        return buffer
    }
    const workers = []

    const historyRoundInfo = await HistoryRoundInfo
        .find({})
        .select({ 'workers.reward': 1, 'workers.stashAccount': 1 })
        .sort({ round: -1 })
        .limit(30 * 24)
        .lean()// 30 days

    // todo add chache in mongodb  or count key in paginate(filterWorkers, workerRequest.pageSize, workerRequest.page)
    function getProfitLastMonth(historyRoundInfo, stashAccount) {
        if (!historyRoundInfo) {
            return 0
        }

        const filterWorkersRule = x => x.stashAccount === stashAccount
        const filterReward = historyRoundInfo.map(roundInfo => roundInfo.workers)
            .flat(1)
            .filter(filterWorkersRule)
            .map(x => x.reward)

        const profitLastMonth = filterReward.reduce((a, b) => a + b, 0)
        return profitLastMonth
    }

    for (const item of filterWorkers) {
        const worker = item.workers

        workers.push({
            stashAccount: worker.stashAccount,
            controllerAccount: worker.controllerAccount,
            payout: worker.payout,
            onlineStatus: worker.onlineStatus,
            status: worker.status,
            stakeEnough: worker.workerStake >= BASE_STAKE_PHA,
            accumulatedStake: worker.accumulatedStake.toString(),
            profitLastMonth: getProfitLastMonth(historyRoundInfo, worker.stashAccount).toString(),
            workerStake: worker.workerStake.toString(),
            userStake: worker.userStake.toString(),
            stakeAccountNum: worker.stakeAccountNum,
            commission: worker.commission,
            taskScore: worker.taskScore,
            machineScore: worker.machineScore,
            apy: worker.apy,
            diffToMinStake: worker.workerStake >= BASE_STAKE_PHA ? 0 : BASE_STAKE_PHA - worker.workerStake,
            stakeToMinApy: 1// todo@@ 基础抵押年化 实时计算 看看产品更新公式
        })
    }

    const message = protobuf.WorkerResponse.create({ status: { success: 0 }, result: { total: total, workers: workers } })
    const buffer = protobuf.WorkerResponse.encode(message).finish()
    return buffer
}
