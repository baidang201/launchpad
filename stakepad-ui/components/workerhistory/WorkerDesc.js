import { Button, Input } from 'antd';
import { Space, Row, Col } from 'antd';

function WorkerDesc() {
  return <div>
        <Row>
          <Col span={8}>Stash</Col>
          <Col span={8}>Controller</Col>
          <Col span={2}>机器分</Col>
          <Col span={2}>任务分</Col>
          <Col span={2}>状态</Col>
        </Row>
        <Row>
          <Col span={8}>42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5j</Col>
          <Col span={8}>42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5g</Col>
          <Col span={2}>230</Col>
          <Col span={2}>280</Col>
          <Col span={2}>在线</Col>
        </Row>
        <Button>标记</Button> <Button>抵押</Button>
      </div>
}

export default WorkerDesc