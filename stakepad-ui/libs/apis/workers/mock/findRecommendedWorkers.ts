import { GetWorkerResult, Worker } from '../..'

export const findRecommendedWorkers: (
    stashAmount: number
) => Promise<GetWorkerResult> = async () => {
    const result: Worker[] = []

    for (let i = 0; i < 10; i++) {
        result.push({
            stash: '5ECEf1DS4CQSfW9RVg7ZUwiuoF7w9WfZT8sGjSNRLUjzD2gT',
            monthlyPayout: 123123.34,
            annualizedReturnRate: 0.2357,
            totalStake: 12234,
            commissionRate: 0.3488,
            taskScore: 12123312.00,
            minerScore: 12123312.00
        })
    }

    return await Promise.resolve({ total: 1499, workers: result })
}
