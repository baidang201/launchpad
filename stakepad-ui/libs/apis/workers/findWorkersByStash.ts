import { GetWorkerResult } from '..'
import { Api, requestSuccess } from '../proto'
import { FindWorkerFilters } from '.'

export type SortingField = 'accumulatedStake' | 'apy' | 'commission' | 'machineScore' | 'profitLastMonth' | 'taskScore'

export const findWorkersByStash = async ({ filters, page, pageSize, sort, sortAsc, stash }: {
    filters: FindWorkerFilters
    page: number
    pageSize: number
    sort?: SortingField
    sortAsc?: boolean
    stash?: string
}): Promise<GetWorkerResult> => {
    const workerRequest: Api.IWorkerRequest = {
        filterCommissionLessThanLimit: filters.commissionRateLessThan20,
        filterRunning: filters.mining,
        filterStakeLessThanMinimum: filters.stakePending,
        filterStashAccounts: stash === undefined ? [] : [stash],
        page,
        pageSize,
        sortAsc,
        sortFieldName: sort
    }

    const payload = Api.CommonRequest.encode(
        Api.CommonRequest.create({ workerRequest })
    ).finish()

    const result = await requestSuccess(payload, Api.WorkerResponse.decode.bind(undefined))

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
