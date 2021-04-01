import { Button, Input } from 'antd';
import { Space, Row, Col } from 'antd';

function Search() {
  return <Space>
        <div><Input placeholder="Stash精确搜索" /> </div>
        <div><Button type="primary">搜索</Button></div>
      </Space>
}

export default Search