import { Col, Row, Space } from 'antd';
import GlobalInfo from '../components/dashboard/GlobalInfo';
import NotificationBar from '../components/dashboard/NotificationBar';
import Search from '../components/dashboard/Search';
import StakeInput from '../components/dashboard/StakeInput';
import SwitchGroup from '../components/dashboard/SwitchGroup';
import WorkerTable from '../components/dashboard/WorkerTable';
import styles from '../styles/pages/dashboard.module.css'

function DashboardPage() {
    return (
        <Space className={styles.container} direction="vertical" size="large">
            <NotificationBar />
            <GlobalInfo />
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