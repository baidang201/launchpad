import { Poc4 } from '@phala/typedefs'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { PolkadotProvider, usePolkadot } from '../libs/polkadot/context'
import { createStyletron } from '../libs/styletron'
import styles from '../styles/pages/_app.module.css'
import { endpoint as PhalaEndpoint } from '../utils/polkadot'

const PolkadotEnabler: React.FC = () => {
    const { enableApi, enableWeb3 } = usePolkadot()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            enableApi().catch((error) => console.error(`Failed to enable Phala API: ${(error as Error)?.message ?? error}`))
            enableWeb3().catch((error) => console.error(`Failed to enable Polkadot web3: ${(error as Error)?.message ?? error}`))
        }
    }, [enableApi, enableWeb3])

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
        <PolkadotProvider endpoint={PhalaEndpoint} originName="Phala Stakepad" registryTypes={Poc4}>
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
                </StyletronProvider>
            </QueryClientProvider>
            <PolkadotEnabler />
        </PolkadotProvider>
    )
}

export default App
