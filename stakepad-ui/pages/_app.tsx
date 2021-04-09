import * as phalaTypedef from '@phala/typedefs/src/phala-typedef'
import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { WalletButton } from '../components/wallet/WalletButton'
import { PolkadotProvider, usePolkadot } from '../libs/polkadot/context'
import '../styles/antd.less'
import '../styles/globals.css'
import styles from '../styles/pages/_app.module.css'
import { endpoint as PhalaEndpoint } from '../utils/polkadot'

const ApiEnabler: React.FC = () => {
    const { enableApi } = usePolkadot()
    useEffect(() => {
        enableApi().catch(() => {
            // TODO: maybe some telemetry?
            // TODO: reflect API enable error on UI
        })
    }, [enableApi])

    return (<></>)
}

const App: AppComponent = ({ Component, pageProps }: AppProps) => {
    const client = useMemo(() => new QueryClient(), [])

    const [selectedTab, setSelectedTab] = useState<string>('dashboard')
    const router = useRouter()

    const onSelectTab = (tab: string): void => {
        setSelectedTab(tab)
        router.push(tab).catch(() => { /* TODO: maybe some telemetry? */ })
    }

    useEffect(() => {
        if (router.isFallback) {
            router.push('/dashboard').catch(() => { /* TODO: maybe some telemetry? */ })
        }
    })

    return (
        <PolkadotProvider endpoint={PhalaEndpoint} originName="Phala Stakepad" registryTypes={phalaTypedef.default}>
            <QueryClientProvider client={client}>
                <Layout hasSider>
                    <Layout.Sider>
                        <Menu selectable={false} selectedKeys={['stakepad']}>
                            <Menu.Item key="1">Home</Menu.Item>
                            <Menu.Item key="2">pWallet</Menu.Item>
                            <Menu.Item key="3">Bridge</Menu.Item>
                            <Menu.Item key="4">Swap</Menu.Item>
                            <Menu.Item key="5">Tokens</Menu.Item>
                            <Menu.Item key="6">Pairs</Menu.Item>
                            <Menu.Item key="7">Transactions</Menu.Item>
                            <Menu.Item key="stakepad">Stakepad</Menu.Item>
                            <Menu.Item key="9">KSM Crowdioan</Menu.Item>
                        </Menu>
                    </Layout.Sider>
                    <Layout className={styles.innerLayout}>
                        <Layout.Header>
                            <div className={styles.walletButtonContainer}><WalletButton /></div>
                            <Menu
                                className={styles.floatRight}
                                mode="horizontal"
                                onSelect={({ key }) => { onSelectTab(key as string) }}
                                selectedKeys={[selectedTab]}
                                theme="dark"
                            >
                                <Menu.Item key="dashboard">主页</Menu.Item>
                                <Menu.Item key="user">我的抵押</Menu.Item>
                                <Menu.Item key="browser">浏览器</Menu.Item>
                                <Menu.Item key="retrievePha">获取Pha</Menu.Item>
                            </Menu>
                        </Layout.Header>
                        <Layout.Content>
                            <Component {...pageProps} />
                        </Layout.Content>
                    </Layout>
                </Layout>
            </QueryClientProvider>
            <ApiEnabler />
        </PolkadotProvider>
    )
}

export default App
