import { WorkerDetails } from '.'

function makeRandomHistory<T>(count: number, timeOffset: number, callback: (index: number, round: number, timestamp: number) => T): T[] {
    const result: T[] = []
    let date = +new Date()
    for (let i = 0; i < count; i++) {
        result.unshift(callback(i, count - i, date -= timeOffset))
    }
    return result
}

export const getWorkerByStash = async (): Promise<WorkerDetails> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return ({
        stash: '14bARWgpfEiURUS7sGGb54V6mvteRhYWDovcjnFMsLfxRxVV',
        controller: '14bARWgpfEiURUS7sGGb54V6mvteRhYWDovcjnFMsLfxRxVV',

        minerScore: 280,
        taskScore: 280,
        online: true,

        favourited: true,

        globalStakeHistory: makeRandomHistory(21, 4 * 60 * 60 * 1000, (i, round, timestamp) => ({
            round,
            stake: i * 10 + Math.random() * 70 + 300,
            timestamp
        })),
        workerStakeHistory: makeRandomHistory(21, 4 * 60 * 60 * 1000, (i, _, timestamp) => ({
            ownerStake: i * 10 + Math.random() * 70 + 300,
            totalStake: i * 10 + Math.random() * 70 + 300,
            timestamp
        })),

        globalRewardHistory: [],
        workerRewardHistory: [],

        commissionRate: makeRandomHistory(21, 4 * 60 * 60 * 1000, (_, round, timestamp) => ({
            round,
            timestamp,
            value: Math.random() * 0.2 + 0.1
        })),

        annualizedReturnRate: makeRandomHistory(21, 4 * 60 * 60 * 1000, (_, round, timestamp) => ({
            round,
            timestamp,
            value: Math.random() * 0.2 + 0.1
        }))
    })
}
