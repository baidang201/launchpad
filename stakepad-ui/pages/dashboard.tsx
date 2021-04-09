import { Col, Divider, Row, Space } from 'antd'
import { GlobalTelemetry } from '../components/dashboard/GlobalTelemetry'
import { StakeInitInput } from '../components/dashboard/ManualStake/ManualStakeInitInput'
import NotificationBar from '../components/dashboard/NotificationBar'
import { RecommendationStakeInit } from '../components/dashboard/RecommendationInitInput'
import WorkerTable from '../components/dashboard/WorkerTable'
import styles from '../styles/pages/dashboard.module.css'

const DashboardPage: React.FC = () => {
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
            <WorkerTable />
        </Space>
    )
}

export default DashboardPage
