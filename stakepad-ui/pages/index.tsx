import { Space } from 'antd'
import { useState } from 'react'
import { GlobalTelemetry } from '../components/dashboard/GlobalTelemetry'
import NotificationBar from '../components/dashboard/NotificationBar'
import { StakeInit } from '../components/dashboard/StakeInit'
import { WorkerTable } from '../components/dashboard/WorkerTable'
import { FindWorkerFilters } from '../libs/apis/workers'
import styles from '../styles/pages/dashboard.module.css'

const DashboardPage: React.FC = () => {
    const [filters, setFilters] = useState<FindWorkerFilters>({
        commissionRateLessThan20: true,
        mining: false,
        stakePending: false
    })
    const [stashFilter] = useState<string | undefined>(undefined)

    return (
        <Space className={styles.container} direction="vertical" size="large">
            <NotificationBar />
            <GlobalTelemetry />
            <StakeInit currentFilters={filters} onFilterChanged={filters => setFilters(filters)} />
            <WorkerTable filters={filters} stash={stashFilter} />
        </Space>
    )
}

export default DashboardPage
