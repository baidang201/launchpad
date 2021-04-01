import { Space, Row, Col } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';


function NoiceBar() {
  return <Row style={{background: "black", color: "white"}}>
    <Col span={1}><NotificationOutlined /></Col>
    <Col span={22}>这是公告栏目</Col>
    <Col span={1}>X</Col>
  </Row>
}

export default NoiceBar