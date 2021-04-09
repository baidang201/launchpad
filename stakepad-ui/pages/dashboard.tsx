import { Col, Row, Space } from 'antd'
import { GlobalTelemetry } from '../components/dashboard/GlobalTelemetry'
import NotificationBar from '../components/dashboard/NotificationBar'
import Search from '../components/dashboard/Search'
import StakeInput from '../components/dashboard/StakeInput'
import SwitchGroup from '../components/dashboard/SwitchGroup'
import WorkerTable from '../components/dashboard/WorkerTable'
import styles from '../styles/pages/dashboard.module.css'

const DashboardPage: React.FC = () => {
    return (
        <Space className={styles.container} direction="vertical" size="large">
            <NotificationBar />
            <GlobalTelemetry />
            <Row>
                <Col span={12}><Search /></Col>
                <Col span={12}><StakeInput /></Col>
            </Row>
            <SwitchGroup />
            <WorkerTable />
        </Space>
    )
}

export default DashboardPage
