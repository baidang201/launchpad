import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { GetWorkerResult } from '../apis'
import { FindWorkerFilters, findWorkersByStash } from '../apis/workers'
import { SortingField } from '../apis/workers/findWorkersByStash'

const WorkersByStashQueryKey = uuidv4()

export const useWorkersByStashQuery = (props: {
    filters: FindWorkerFilters
    page: number
    pageSize: number
    sort?: SortingField
    sortAsc?: boolean
    stash?: string
}): UseQueryResult<GetWorkerResult> => {
    const { filters, page, pageSize, sort, sortAsc, stash } = props

    return useQuery(
        [WorkersByStashQueryKey, JSON.stringify(filters), stash, page, pageSize, sort, sortAsc],
        async () => await findWorkersByStash(props)
    )
}
