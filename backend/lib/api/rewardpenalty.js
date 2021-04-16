import protobuf from '../protobuf/protobuf.js'
import { HistoryRoundInfo } from '../models/historyRoundInfo.js'
import { padArrayStart, sumEvery, averageEvery } from '../utils/index.js'

export async function getRewardPenalty(rewardPenaltyRequest) {
    const historyRoundInfo = await HistoryRoundInfo
        .find({ 'workers.stashAccount': rewardPenaltyRequest.stashAccount })
        .select({ round: 1, startedAt: 1, 'workers.$': 1 })
        .sort({ round: -1 })
        .limit(30 * 24)
        .lean()// 30 days
    if (!historyRoundInfo) {
        const message = protobuf.RewardPenaltyResponse.create({ status: { success: -1, msg: 'can not find data in database' } })
        const buffer = protobuf.RewardPenaltyResponse.encode(message).finish()
        return buffer
    }

    const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
        .flat(1)

    const rewards = sumEvery(filterWorkers.map(x => x.reward), 4).reverse()
    const penaltys = sumEvery(filterWorkers.map(x => x.penalty), 4).reverse()
    const filterRoundInfos = historyRoundInfo.filter((element, index) => { return index % 4 === 0 }).reverse()

    const mergeRoundInfos = []
    for (let index = 0; index < filterRoundInfos.length; index++) {
        mergeRoundInfos[index] = filterRoundInfos[index]
        mergeRoundInfos[index].timestamp = filterRoundInfos[index].startedAt.getTime() / 1000
        mergeRoundInfos[index].reward = rewards[index].toString()
        mergeRoundInfos[index].penalty = penaltys[index].toString()
    }

    const rt = {
        status: { success: 0 },
        result: {
            rewardPenaltyInfos: mergeRoundInfos
        }
    }

    const message = protobuf.RewardPenaltyResponse.create(rt)
    const buffer = protobuf.RewardPenaltyResponse.encode(message).finish()
    return buffer
}

export async function getAvgReward() {
    const historyRoundInfo = await HistoryRoundInfo
        .find({})
        .select({ round: 1, startedAt: 1, avgReward: 1 })
        .sort({ round: -1 })
        .limit(30 * 24)
        .lean()// 30 days

    if (!historyRoundInfo) {
        const message = protobuf.AvgRewardResponse.create({ status: { success: -1, msg: 'can not find data in database' } })
        const buffer = protobuf.AvgRewardResponse.encode(message).finish()
        return buffer
    }

    const avgrewards = sumEvery(historyRoundInfo.map(x => x.avgReward), 4).reverse()
    const filterRoundInfos = historyRoundInfo.filter((element, index) => { return index % 4 === 0 }).reverse()
    const mergeRoundInfos = []

    for (let index = 0; index < filterRoundInfos.length; index++) {
        mergeRoundInfos[index] = filterRoundInfos[index]
        mergeRoundInfos[index].timestamp = filterRoundInfos[index].startedAt.getTime() / 1000
        mergeRoundInfos[index].avgReward = avgrewards[index].toString()
    }

    const rt = {
        status: { success: 0 },
        result: {
            avgRewardInfos: mergeRoundInfos
        }
    }

    const message = protobuf.AvgRewardResponse.create(rt)
    const buffer = protobuf.AvgRewardResponse.encode(message).finish()
    return buffer
}
