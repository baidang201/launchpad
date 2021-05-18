import { Pagination } from 'baseui/pagination'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { StakeInit } from '../components/dashboard/StakeInit'
import { MinerTable } from '../components/dashboard/WorkerTable'
import { FindWorkerFilters, findWorkersByStash } from '../libs/apis/workers'

const defaultPageSize = 10

const DashboardPage: React.FC = () => {
    const [filters, setFilters] = useState<FindWorkerFilters>({
        commissionRateLessThan20: true,
        mining: false,
        stakePending: false
    })
    const [stashFilter, setStashFilter] = useState<string | undefined>(undefined)

    const [currentPage, setCurrentPage] = useState(1)
    const { data, isFetched } = useQuery(
        ['api', 'findWorkersByStash', filters, currentPage, defaultPageSize, stashFilter],
        async () => await findWorkersByStash(filters, currentPage, defaultPageSize, stashFilter)
    )
    const totalPages = useMemo(() => Math.ceil((data?.total ?? 0) / defaultPageSize), [data])

    // const [, setSelection] = useState<string[]>()
    // const handleSelectionChange = (miners: string[]): void => { setSelection(miners) }

    return (
        <>
            {/* <GlobalTelemetry /> */}
            <StakeInit
                currentFilters={filters}
                onFilterChanged={setFilters}
                onStashChanged={stash => setStashFilter(typeof stash === 'string' && stash.length > 0 ? stash : undefined)}
            />

            <MinerTable
                isLoading={!isFetched}
                miners={data?.workers ?? []}
            // onSelectionChange={handleSelectionChange}
            />

            <Pagination
                currentPage={currentPage}
                numPages={totalPages}
                onPageChange={({ nextPage }) => setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))}
            />
        </>
    )
}

export default DashboardPage
