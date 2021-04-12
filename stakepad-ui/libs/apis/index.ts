export interface Worker {
    annualizedReturnRate: number
    commissionRate: number
    monthlyPayout: number

    minerScore: number
    taskScore: number
    totalStake: number

    stash: string
}

export interface ValueWithTimestamp<T> {
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

    averageTotalStake: Array<ValueWithTimestamp<number>>
    ownerStake: Array<ValueWithTimestamp<number>>
    totalStake: Array<ValueWithTimestamp<number>>

    commissionRate: Array<ValueWithTimestamp<number>>

    penalty: Array<ValueWithTimestamp<number>>
    reward: Array<ValueWithTimestamp<number>>

    annualizedReturnRate: Array<ValueWithTimestamp<number>>
}

export interface GetWorkerResult {
    total: number
    workers: Worker[]
}
