import { FindWorkerFilters } from '.'
import { GetWorkerResult } from '..'
import { Api, requestSuccess } from '../proto'

export const findWorkersByStash: (
    filters: FindWorkerFilters, page: number, pageSize: number, stash?: string
) => Promise<GetWorkerResult> = async (filters, page, pageSize, stash) => {
    const workerRequest: Api.IWorkerRequest = {
        filterCommissionLessThen: filters.commissionRateLessThan20,
        filterRuning: filters.mining,
        filterStakeEnough: !filters.stakePending,
        filterStashAccounts: stash === undefined ? [] : [stash],
        page,
        pageSize
    }
    const payload = Api.CommonRequest.encode(
        Api.CommonRequest.create({ workerRequest })
    ).finish()

    const result = await requestSuccess(payload, Api.WorkerResponse.decode)

    return ({
        total: result.total ?? 0,
        workers: result.workers?.map(worker => ({
            annualizedReturnRate: worker.apy ?? 0,
            commissionRate: worker.commission ?? 0,
            minerScore: worker.machineScore ?? 0,
            monthlyPayout: parseInt(worker.profitLastMonth ?? '0'),
            stash: worker.stashAccount ?? 'unknown',
            taskScore: worker.taskScore ?? 0,
            totalStake: parseInt(worker.accumulatedStake ?? '0')
        })) ?? []
    })
}
