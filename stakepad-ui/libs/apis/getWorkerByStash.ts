import { WorkerDetails, WorkerHistoryPoint } from '.'

function makeRandomHistory(count: number, min: number, max: number, time: number): Array<WorkerHistoryPoint<number>> {
    const result: Array<WorkerHistoryPoint<number>> = []
    let date = +new Date()
    let round = count
    for (let i = 0; i < count; i++) {
        result.unshift({
            round: --round,
            timestamp: date,
            value: Math.random() * (max - min) + min
        })
        date -= time
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

        averageTotalStake: makeRandomHistory(21, 380, 1000, 4 * 60 * 60 * 1000),
        totalStake: makeRandomHistory(21, 380, 1000, 4 * 60 * 60 * 1000),
        ownerStake: makeRandomHistory(21, 380, 1000, 4 * 60 * 60 * 1000),

        commissionRate: makeRandomHistory(21, 0.1, 0.3, 4 * 60 * 60 * 1000),

        penalty: makeRandomHistory(21, 380, 1000, 4 * 60 * 60 * 1000),
        reward: makeRandomHistory(21, 380, 1000, 4 * 60 * 60 * 1000),

        annualizedReturnRate: makeRandomHistory(21, 0.3, 0.8, 4 * 60 * 60 * 1000)
    })
}
