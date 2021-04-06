import { Space, Row, Col } from 'antd';

import Search from '../components/dashboard/Search'
import GlobalInfo from '../components/dashboard/GlobalInfo'
import NotificationBar from '../components/dashboard/NotificationBar'
import StakeInput from '../components/dashboard/StakeInput'
import SwitchGroup from '../components/dashboard/SwitchGroup'
import WorkerTable from '../components/dashboard/WorkerTable'

function DashBoardPage() {
  return <Space direction="vertical" size={30} style={{width: "100%"}}>
    <NotificationBar/>
    <GlobalInfo/>
    <Row>
      <Col span={12}><Search/></Col>
      <Col span={12}><StakeInput/></Col>
    </Row>
    <SwitchGroup/>
    <WorkerTable/>
  </Space>
}

export default DashBoardPage