import { Pagination } from 'baseui/pagination'
import React, { ReactElement, useMemo, useState } from 'react'
import { InjectedAccountSelect } from '../components/accounts/AccountSelect'
import { MinerTable } from '../components/dashboard/MinerTable'
import { StakeInit } from '../components/dashboard/StakeInit'
import { PositionTable } from '../components/stakes/PositionTable'
import { FindWorkerFilters } from '../libs/apis/workers'
import { SortingField } from '../libs/apis/workers/findWorkersByStash'
import { useWorkersByStashQuery } from '../libs/queries/useWorkersByStash'

const defaultPageSize = 10

const Dashboard = ({ setMiners }: { setMiners: (miners: string[]) => void }): ReactElement => {
    const [filters, setFilters] = useState<FindWorkerFilters>({
        commissionRateLessThan20: true,
        mining: false,
        stakePending: false
    })
    const [sort, setSort] = useState<SortingField>()
    const [sortAsc, setSortAsc] = useState<boolean>()
    const [stashFilter, setStashFilter] = useState<string | undefined>(undefined)

    const [currentPage, setCurrentPage] = useState(1)
    const { data, isFetched } = useWorkersByStashQuery({
        filters, page: currentPage, pageSize: defaultPageSize, sort, sortAsc, stash: stashFilter
    })
    const totalPages = useMemo(() => Math.ceil((data?.total ?? 0) / defaultPageSize), [data])

    const [selection, setSelection] = useState<string[]>()
    const handleSelectionChange = (miners: string[]): void => { setSelection(miners) }

    const handleClickManual = (): void => {
        if (selection !== undefined && selection.length > 0) {
            setMiners(selection)
        }
    }

    const handleSortChange = (sort?: SortingField, asc?: boolean): void => {
        setSort(sort)
        setSortAsc(asc)
    }

    return (
        <>
            {/* <GlobalTelemetry /> */}

            <StakeInit
                currentFilters={filters}
                onClickManual={() => handleClickManual()}
                onFilterChanged={setFilters}
                onStashChanged={stash => setStashFilter(typeof stash === 'string' && stash.length > 0 ? stash : undefined)}
            />

            <MinerTable
                isLoading={!isFetched}
                miners={data?.workers ?? []}
                onSelectionChange={handleSelectionChange}
                onSortChange={handleSortChange}
            />

            <Pagination
                currentPage={currentPage}
                numPages={totalPages}
                onPageChange={({ nextPage }) => setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))}
            />
        </>
    )
}

const DashboardPage = (): ReactElement => {
    const [miners, setMiners] = useState<string[]>()
    const [staker, setStaker] = useState<string>()

    if (miners !== undefined) {
        return (
            <>
                <InjectedAccountSelect onChange={address => setStaker(address)} />
                <PositionTable miners={miners} staker={staker} />
            </>
        )
    } else {
        return (<Dashboard setMiners={miners => setMiners(miners)} />)
    }
}

export default DashboardPage
