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

export interface GlobalStakeHistoryPoint {
    round: number
    stake: number
    timestamp: number
}

export interface WorkerStakeHistoryPoint {
    ownerStake: number
    timestamp: number
    totalStake: number
}

export interface GlobalRewardHistoryPoint {
    reward: number
    round: number
    timestamp: number
}

export interface WorkerRewardHistoryPoint {
    reward: number
    penalty: number
    timestamp: number
}

export interface WorkerDetails {
    controller: string
    stash: string

    minerScore: number
    online: boolean
    taskScore: number

    favourited: boolean

    globalStakeHistory: GlobalStakeHistoryPoint[]
    workerStakeHistory: WorkerStakeHistoryPoint[]

    globalRewardHistory: GlobalRewardHistoryPoint[]
    workerRewardHistory: WorkerRewardHistoryPoint[]

    commissionRate: Array<WorkerHistoryPoint<number>>

    annualizedReturnRate: Array<WorkerHistoryPoint<number>>
}

export interface GetWorkerResult {
    total: number
    workers: Worker[]
}
