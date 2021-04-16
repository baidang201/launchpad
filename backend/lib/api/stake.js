
import protobuf from '../protobuf/protobuf.js'
import { HistoryRoundInfo } from '../models/historyRoundInfo.js'
import { padArrayStart, sumEvery, averageEvery } from '../utils/index.js'

export async function getStakeinfo(stakeInfoRequest) {
    const historyRoundInfo = await HistoryRoundInfo
        .find({ 'workers.stashAccount': stakeInfoRequest.stashAccount })
        .select({ round: 1, startedAt: 1, 'workers.$': 1 })
        .sort({ round: -1 })
        .limit(30 * 24)
        .lean()// 30 days

    if (!historyRoundInfo) {
        const message = protobuf.StakeInfoResponse.create({ status: { success: -1, msg: 'can not find data in database' } })
        const buffer = protobuf.StakeInfoResponse.encode(message).finish()
        return buffer
    }

    const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
        .flat(1)

    const accumulatedStakes = averageEvery(filterWorkers.map(x => x.accumulatedStake), 4).reverse()
    const workerStakes = averageEvery(filterWorkers.map(x => x.workerStake), 4).reverse()
    const filterRoundInfos = historyRoundInfo.filter((element, index) => { return index % 4 === 0 }).reverse()

    const mergeRoundInfos = []
    for (let index = 0; index < filterRoundInfos.length; index++) {
        mergeRoundInfos[index] = filterRoundInfos[index]
        mergeRoundInfos[index].timestamp = filterRoundInfos[index].startedAt.getTime() / 1000
        mergeRoundInfos[index].accumulatedStake = accumulatedStakes[index].toString()
        mergeRoundInfos[index].workerStake = workerStakes[index].toString()
    }

    const rt = {
        status: { success: 0 },
        result: {
            stakeInfos: mergeRoundInfos
        }
    }

    const message = protobuf.StakeInfoResponse.create(rt)
    const buffer = protobuf.StakeInfoResponse.encode(message).finish()
    return buffer
}

export async function getAvgStake() {
    const historyRoundInfo = await HistoryRoundInfo
        .find({})
        .select({ round: 1, startedAt: 1, avgStake: 1 })
        .sort({ round: -1 })
        .limit(30 * 24)
        .lean()// 30 days

    if (!historyRoundInfo) {
        const message = protobuf.AvgStakeResponse.create({ status: { success: -1, msg: 'can not find data in database' } })
        const buffer = protobuf.AvgStakeResponse.encode(message).finish()
        return buffer
    }

    const avgStakes = averageEvery(historyRoundInfo.map(x => x.avgStake), 4).reverse()
    const filterRoundInfos = historyRoundInfo.filter((element, index) => { return index % 4 === 0 }).reverse()
    const mergeRoundInfos = []

    for (let index = 0; index < filterRoundInfos.length; index++) {
        mergeRoundInfos[index] = filterRoundInfos[index]
        mergeRoundInfos[index].timestamp = filterRoundInfos[index].startedAt.getTime() / 1000
        mergeRoundInfos[index].avgStake = avgStakes[index].toString()
    }

    const rt = {
        status: { success: 0 },
        result: {
            avgStakeInfos: mergeRoundInfos
        }
    }

    const message = protobuf.AvgStakeResponse.create(rt)
    const buffer = protobuf.AvgStakeResponse.encode(message).finish()
    return buffer
}
