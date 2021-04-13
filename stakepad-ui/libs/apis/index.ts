export interface Worker {
    annualizedReturnRate: number
    commissionRate: number
    monthlyPayout: number

    minerScore: number
    taskScore: number
    totalStake: number

    stash: string
}

export interface WorkerHistoryPoint<T> {
    round: number
    timestamp: number
    value: T
}

export interface WorkerDetails {
    controller: string
    stash: string

    minerScore: number
    online: boolean
    taskScore: number

    favourited: boolean

    averageTotalStake: Array<WorkerHistoryPoint<number>>
    ownerStake: Array<WorkerHistoryPoint<number>>
    totalStake: Array<WorkerHistoryPoint<number>>

    commissionRate: Array<WorkerHistoryPoint<number>>

    penalty: Array<WorkerHistoryPoint<number>>
    reward: Array<WorkerHistoryPoint<number>>

    annualizedReturnRate: Array<WorkerHistoryPoint<number>>
}

export interface GetWorkerResult {
    total: number
    workers: Worker[]
}
