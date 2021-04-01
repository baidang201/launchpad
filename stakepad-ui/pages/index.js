import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import DashBoardPage from "./dashboard.js";
import Worker from "./worker.js"

const { Header, Content, Sider } = Layout;

export default function Home() {
  return (
<Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{float: 'right'}}>
        <Menu.Item key="1">我的抵押</Menu.Item>
        <Menu.Item key="2">浏览器</Menu.Item>
        <Menu.Item key="3">获取Pha</Menu.Item>
      </Menu>
    </Header>
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="9">Home</Menu.Item>
          <Menu.Item key="10">pWallet</Menu.Item>
          <Menu.Item key="11">Bridge</Menu.Item>
          <Menu.Item key="12">Swap</Menu.Item>
          <Menu.Item key="13">Tokens</Menu.Item>
          <Menu.Item key="14">Pairs</Menu.Item>
          <Menu.Item key="15">Transactions</Menu.Item>

          <Menu.Item key="16">Stakepad</Menu.Item>
          <Menu.Item key="17">KSM Crowdioan</Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* <DashBoardPage/> */}
          <Worker/>
        </Content>
      </Layout>
    </Layout>
  </Layout>
  )
}
