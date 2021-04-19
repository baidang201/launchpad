import { FindWorkerFilters } from '.'
import { GetWorkerResult } from '..'
import { APIError } from '../errors'
import { Api, requestDecoded } from '../proto'

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

    const { status, result } = await requestDecoded(payload, Api.WorkerResponse.decode)

    if (status?.success !== 0) {
        throw new APIError(status?.msg ?? 'Unknown error', status?.success ?? undefined)
    }

    if (result === undefined || result === null) {
        throw new APIError('Result is null or undefined')
    }

    return ({
        total: result.total ?? 0,
        workers: result.workers?.map?.(worker => ({
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
