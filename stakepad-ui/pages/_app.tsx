import { Poc4 } from '@phala/typedefs'
import { AppNavBar, NavItemT, setItemActive } from 'baseui/app-nav-bar'
import { LayersManager } from 'baseui/layer'
import { Spinner } from 'baseui/spinner'
import { PLACEMENT as ToastPlacement, toaster, ToasterContainer } from 'baseui/toast'
import { AppComponent, AppProps } from 'next/dist/next-server/lib/router/router'
import { useRouter } from 'next/router'
import { Key, PropsWithChildren, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider, useIsFetching } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { v4 as uuidv4 } from 'uuid'
import { endpoint as PhalaEndpoint } from '../libs/config'
import { ApiPromiseProvider, AppName, Web3Provider } from '../libs/polkadot'
import { createStyletron } from '../libs/styletron'
import styles from '../styles/pages/_app.module.css'

interface NavItemWithTarget extends NavItemT {
    info: {
        target: string
    }
}

const GlobalFetchingToasterContainerKey = uuidv4()

const GlobalFetchingToasterContainer = ({ children }: PropsWithChildren<{}>): ReactElement => {
    const isFetching = useIsFetching()

    const loadingToaster = useRef<Key>()

    useEffect(() => {
        if (isFetching > 0 && loadingToaster.current === undefined) {
            loadingToaster.current = toaster.info(
                <Spinner />,
                {
                    closeable: false,
                    key: GlobalFetchingToasterContainerKey,
                    overrides: {
                        Body: {
                            style: { backgroundColor: 'black', width: 'auto' }
                        }
                    }
                }
            )
        }

        if (isFetching === 0 && loadingToaster.current !== undefined) {
            toaster.clear(loadingToaster.current)
            loadingToaster.current = undefined
        }
    }, [isFetching])

    return (<ToasterContainer placement={ToastPlacement.bottomLeft}>{children}</ToasterContainer>)
}

const App: AppComponent = ({ Component, pageProps }: AppProps) => {
    const client = useMemo(() => new QueryClient(), [])
    const styletron = useMemo(() => createStyletron(), [])

    const { pathname, push } = useRouter()

    const [mainItems, setMainItems] = useState<NavItemWithTarget[]>([
        {
            active: pathname === '/',
            label: '主页',
            info: { target: '/' }
        }, {
            active: pathname === '/accounts',
            label: '账户',
            info: { target: '/accounts' }
        }
    ])

    const handleMainItemSelect = (item: NavItemWithTarget): void => {
        push(item.info.target).catch(error => {
            console.error(`[_app] Failed navigating to ${item.info.target}: ${(error as Error)?.message ?? error}`)
        })
        setMainItems(prev => setItemActive(prev, item) as NavItemWithTarget[])
    }

    return (
        <ApiPromiseProvider endpoint={PhalaEndpoint} registryTypes={Poc4}>
            <Web3Provider originName={AppName}>
                <QueryClientProvider client={client}>
                    <StyletronProvider value={styletron}>
                        <LayersManager>
                            <GlobalFetchingToasterContainer>
                                <AppNavBar
                                    mainItems={mainItems}
                                    onMainItemSelect={item => handleMainItemSelect(item as NavItemWithTarget)}
                                    title="Stakepad"
                                />

                                <div className={styles.container}>
                                    <Component {...pageProps} />
                                </div>
                            </GlobalFetchingToasterContainer>
                        </LayersManager>
                    </StyletronProvider>
                </QueryClientProvider>
            </Web3Provider>
        </ApiPromiseProvider >
    )
}

export default App
