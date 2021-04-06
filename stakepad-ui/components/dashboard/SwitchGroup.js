import { Col, Row, Space, Switch } from 'antd';

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

function SwitchGroup() {
  return <div>
      <Space size="large">
        <div><Switch defaultChecked onChange={onChange} />不超过20%分润</div>
        <div><Switch defaultChecked onChange={onChange} />未满足基础抵押</div>
        <div><Switch defaultChecked onChange={onChange} />运行</div>
        <div><Switch defaultChecked onChange={onChange} />标记</div>
      </Space>
  </div>
}

export default SwitchGroup