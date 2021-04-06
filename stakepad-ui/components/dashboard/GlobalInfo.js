import { Space, Row, Col } from 'antd';

function GlobalInfo() {
  return <div>
    <Row>
      <Col span={2}>抵押年化</Col>
      <Col span={4}>上一轮奖励量</Col>
      <Col span={4}>Round</Col>
      <Col span={4}>抵押额</Col>
      <Col span={4}>在线矿工数/矿工费</Col>
      <Col span={4}>平均抵押额</Col>
    </Row>
    <Row>
      <Col span={2}>15.3%</Col>
      <Col span={4}>123，123 PHA</Col>
      <Col span={4}>1234 （36min）</Col>
      <Col span={4}>123，233 PHA</Col>
      <Col span={4}>1，223/53，532</Col>
      <Col span={4}>13，222 PHA</Col>
    </Row>
  </div> 
}

export default GlobalInfo