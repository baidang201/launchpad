import { WorkerDetails, WorkerHistoryPoint, WorkerRewardHistoryPoint, WorkerStakeHistoryPoint } from '..'
import { Api, requestSuccess } from '../proto'
import { getWorkerByStash as getMockWorkerByStash } from './mock/getWorkerByStash'

export const getWorkerByStash = async (stash: string): Promise<WorkerDetails> => {
    return await getMockWorkerByStash()
}

export const getAnnualizedReturnRateHistoryByStash = async (stash: string): Promise<Array<WorkerHistoryPoint<number>>> => {
    const payload = Api.CommonRequest.encode(Api.CommonRequest.create({ apyRequest: { stashAccount: stash } })).finish()
    const result = await requestSuccess(payload, Api.ApyResponse.decode.bind(undefined))
    return (result.apyInfos ?? []).map(point => ({
        round: point.round ?? 0,
        timestamp: point.timestamp ?? 0,
        value: point.apy ?? 0
    }))
}

export const getCommissionRateHistoryByStash = async (stash: string): Promise<Array<WorkerHistoryPoint<number>>> => {
    const payload = Api.CommonRequest.encode(Api.CommonRequest.create({ commissionRequest: { stashAccount: stash } })).finish()
    const result = await requestSuccess(payload, Api.CommissionResponse.decode.bind(undefined))
    return (result.commissionInfos ?? []).map(point => ({
        round: point.round ?? 0,
        timestamp: point.timestamp ?? 0,
        value: point.commission ?? 0
    }))
}

export const getRewardHistoryByStash = async (stash: string): Promise<WorkerRewardHistoryPoint[]> => {
    const payload = Api.CommonRequest.encode(Api.CommonRequest.create({ rewardPenaltyRequest: { stashAccount: stash } })).finish()
    const result = await requestSuccess(payload, Api.RewardPenaltyResponse.decode.bind(undefined))
    return (result.rewardPenaltyInfos ?? []).map(point => ({
        round: point.round ?? 0,
        penalty: parseInt(point.penalty ?? '0'),
        reward: parseInt(point.reward ?? '0'),
        timestamp: point.timestamp ?? 0
    }))
}

export const getStakeHistoryByStash = async (stash: string): Promise<WorkerStakeHistoryPoint[]> => {
    const payload = Api.CommonRequest.encode(Api.CommonRequest.create({ rewardPenaltyRequest: { stashAccount: stash } })).finish()
    const result = await requestSuccess(payload, Api.StakeInfoResponse.decode.bind(undefined))
    return (result.stakeInfos ?? []).map(point => ({
        ownerStake: parseInt(point.workerStake ?? '0'),
        round: point.round ?? 0,
        timestamp: point.timestamp ?? 0,
        totalStake: parseInt(point.accumulatedStake ?? '0')
    }))
}
