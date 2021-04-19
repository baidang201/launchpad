import * as phalaTypedef from '@phala/typedefs/src/phala-typedef'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { PolkadotProvider, usePolkadot } from '../libs/polkadot/context'
import { createStyletron } from '../libs/styletron'
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
    const styletron = useMemo(() => createStyletron(), [])

    // const [selectedTab, setSelectedTab] = useState<string>('dashboard')
    // const router = useRouter()

    // const onSelectTab = (tab: string): void => {
    //     setSelectedTab(tab)
    //     router.push(tab).catch(() => { /* TODO: maybe some telemetry? */ })
    // }

    const [mainItems, setMainItems] = useState<NavItemT[]>([
        { label: '主页' }
    ])

    return (
        <PolkadotProvider endpoint={PhalaEndpoint} originName="Phala Stakepad" registryTypes={phalaTypedef.default}>
            <QueryClientProvider client={client}>
                <StyletronProvider value={styletron}>
                    <AppNavBar
                        mainItems={mainItems}
                        onMainItemSelect={item => setMainItems(prev => setItemActive(prev, item))}
                        title="Stakepad"
                    />

                    <div className={styles.container}>
                        <Component {...pageProps} />
                    </div>

                    {/* <Layout hasSider>
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
                                // className={styles.floatRight}
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

                        </Layout.Content>
                    </Layout>
                </Layout> */}
                </StyletronProvider>
            </QueryClientProvider>
            <ApiEnabler />
        </PolkadotProvider>
    )
}

export default App
