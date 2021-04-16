import { Col, Divider, Row, Space } from 'antd'
import { useState } from 'react'
import { GlobalTelemetry } from '../components/dashboard/GlobalTelemetry'
import { StakeInitInput } from '../components/dashboard/ManualStake/ManualStakeInitInput'
import NotificationBar from '../components/dashboard/NotificationBar'
import { RecommendationStakeInit } from '../components/dashboard/RecommendationInitInput'
import { WorkerTable } from '../components/dashboard/WorkerTable'
import { FindWorkerFilters } from '../libs/apis/workers/mock/findWorkersByStash'
import styles from '../styles/pages/dashboard.module.css'

const DashboardPage: React.FC = () => {
    const [filters] = useState<FindWorkerFilters>({
        commissionRateLessThan20: true,
        mining: false,
        stakePending: false
    })
    const [stashFilter] = useState<string | undefined>(undefined)

    return (
        <Space className={styles.container} direction="vertical" size="large">
            <NotificationBar />
            <GlobalTelemetry />
            <Row gutter={8}>
                <Col flex="16em"><RecommendationStakeInit /></Col>
                <Col flex="none">
                    <Divider style={{ height: '2.4em' }} type="vertical" />
                </Col>
                <Col flex="auto"><StakeInitInput /></Col>
            </Row>
            <WorkerTable filters={filters} stash={stashFilter} />
        </Space>
    )
}

export default DashboardPage
