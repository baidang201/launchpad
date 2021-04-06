import { Button, Space, Row, Col } from 'antd';
import { NotificationOutlined, CloseOutlined } from '@ant-design/icons';


function NotificationBar() {
  return <Row style={{background: "black", color: "white"}} align="middle">
      <Col span={1}><NotificationOutlined /></Col>
      <Col span={22}>这是公告栏目</Col>
      <Col span={1}> <Button type="text" style={{background: "black", color: "white"}}><CloseOutlined /></Button></Col>
  </Row>
}

export default NotificationBar