import { CloseOutlined, NotificationOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'

function NotificationBar() {
    return <Row align="middle">
        <Col span={1}><NotificationOutlined /></Col>
        <Col span={22}>这是公告栏目</Col>
        <Col span={1}> <Button type="text" style={{ background: 'black', color: 'white' }}><CloseOutlined /></Button></Col>
    </Row>
}

export default NotificationBar
