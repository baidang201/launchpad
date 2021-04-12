export interface Worker {
    annualizedReturnRate: number
    commissionRate: number
    monthlyPayout: number

    minerScore: number
    taskScore: number
    totalStake: number

    stash: string
}

export interface GetWorkerResult {
    total: number
    workers: Worker[]
}
