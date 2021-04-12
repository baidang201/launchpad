import { ValueWithTimestamp, WorkerDetails } from '.'

function makeRandomHistory(count: number, min: number, max: number, time: number): Array<ValueWithTimestamp<number>> {
    const result: Array<ValueWithTimestamp<number>> = []
    let date = +new Date()
    for (let i = 0; i < 99; i++) {
        result.unshift({
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

        averageTotalStake: makeRandomHistory(42, 380, 1000, 4 * 60 * 60 * 1000),
        totalStake: makeRandomHistory(42, 380, 1000, 4 * 60 * 60 * 1000),
        ownerStake: makeRandomHistory(42, 380, 1000, 4 * 60 * 60 * 1000),

        commissionRate: makeRandomHistory(42, 0.1, 0.3, 4 * 60 * 60 * 1000),

        penalty: makeRandomHistory(42, 380, 1000, 4 * 60 * 60 * 1000),
        reward: makeRandomHistory(42, 380, 1000, 4 * 60 * 60 * 1000),

        annualizedReturnRate: makeRandomHistory(42, 0.3, 0.8, 4 * 60 * 60 * 1000)
    })
}
