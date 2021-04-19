import { useState } from 'react'
import { StakeInit } from '../components/dashboard/StakeInit'
import { FindWorkerFilters } from '../libs/apis/workers'

const DashboardPage: React.FC = () => {
    const [filters, setFilters] = useState<FindWorkerFilters>({
        commissionRateLessThan20: true,
        mining: false,
        stakePending: false
    })
    // const [stashFilter] = useState<string | undefined>(undefined)

    return (
        <>
            {/* <GlobalTelemetry /> */}
            <StakeInit currentFilters={filters} onFilterChanged={filters => setFilters(filters)} />
            {/* <WorkerTable filters={filters} stash={stashFilter} /> */}
        </>
    )
}

export default DashboardPage
