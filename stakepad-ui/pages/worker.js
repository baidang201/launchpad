import { Space, Row, Col } from 'antd';

import ApyChat from '../components/workerhistory/ApyChat'
import CommissionChat from '../components/workerhistory/CommissionChat'
import RewardChat from '../components/workerhistory/RewardChat'
import StakeChat from '../components/workerhistory/StakeChat'
import WorkerDesc from '../components/workerhistory/WorkerDesc'


function Worker() {
  return <Space direction="vertical" style={{width: "100%"}}>
    <WorkerDesc/>
    <div/>
    <Row>
      <Col span={12}><StakeChat/></Col>
      <Col span={12}><CommissionChat/></Col>
    </Row>
    <Row>
      <Col span={12}><RewardChat/></Col>
      <Col span={12}><ApyChat/></Col>
    </Row>
  </Space>
}

export default Worker