import { Button, Input } from 'antd';
import { Space, Row, Col } from 'antd';

function StakeInput() {
  return <Space size="large">
        <Input placeholder="请先输入抵押额" /> 
        <Button type="primary">推荐抵押</Button>
        <Button type="primary">自选抵押</Button>
      </Space>
}

export default StakeInput