import { GlobalTelemetry } from '.'

export async function getGlobalTelemetry(): Promise<GlobalTelemetry> {
    return {
        annualizedReturnRate: 0.153,
        currentRound: 12434,
        currentRoundClock: 45,
        lastRoundReturn: 123123,

        averageStake: 12434,
        totalStake: 12434,
        totalStakeRate: 0.63,

        allWorkers: 534568,
        onlineWorkers: 12434
    }
}
