import { Api, requestSuccess } from '../proto'

export interface GlobalTelemetry {
    annualizedReturnRate: number
    currentRound: number
    currentRoundClock: number
    lastRoundReturn: number

    averageStake: number
    totalStake: number
    totalStakeRate: number

    allWorkers: number
    onlineWorkers: number
}

export async function getGlobalTelemetry(): Promise<GlobalTelemetry> {
    const payload = Api.CommonRequest.encode(
        Api.CommonRequest.create({
            globalStatisticsRequest: {}
        })
    ).finish()

    const result = await requestSuccess(payload, Api.GlobalStatisticsResponse.decode)

    return {
        allWorkers: result.workerNum ?? -1,
        annualizedReturnRate: result.apy ?? 0,
        averageStake: parseInt(result.avgStake ?? '0'), // TODO: parse using BN
        currentRound: result.round ?? 0,
        currentRoundClock: (result.roundCycleTime ?? 0) / 60,
        lastRoundReturn: parseInt(result.rewardLastRound ?? '0'), // TODO: parse using BN
        onlineWorkers: result.onlineWorkerNum ?? 0,
        totalStake: parseInt(result.stakeSum ?? '0'), // TODO: parse using BN
        totalStakeRate: result.stakeSupplyRate ?? 0
    }
}
