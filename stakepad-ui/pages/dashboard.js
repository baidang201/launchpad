import { Space, Row, Col } from 'antd';

import Search from '../components/dashboard/Search'
import GlobalInfo from '../components/dashboard/GlobalInfo'
import NoiceBar from '../components/dashboard/NoiceBar'
import StakeInput from '../components/dashboard/StakeInput'
import SwitchGroup from '../components/dashboard/SwitchGroup'
import WorkerTable from '../components/dashboard/WorkerTable'

function DashBoardPage() {
  return <Space direction="vertical" size={30} style={{width: "100%"}}>
    <NoiceBar/>
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