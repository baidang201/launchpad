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
