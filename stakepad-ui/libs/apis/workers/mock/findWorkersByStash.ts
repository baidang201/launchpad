import { FindWorkerFilters } from '..'
import { GetWorkerResult, Worker } from '../..'

const total = 1498

export const findWorkersByStash: (
    filters: FindWorkerFilters, page: number, pageSize: number, stash?: string
) => Promise<GetWorkerResult> = async (filters, page, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const result: Worker[] = []

    for (let i = 0; i < Math.min(total - (page * pageSize), pageSize); i++) {
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

    return { total, workers: result }
}
