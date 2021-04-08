import { default as ApiTypes } from '@phala/typedefs/src/phala-typedef'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { useEffect, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PolkadotProvider, usePolkadot } from '../libs/polkadot/context'
import '../styles/antd.less'
import '../styles/globals.css'
import { endpoint as PhalaEndpoint } from '../utils/polkadot'

const ApiEnabler: React.FC = () => {
    const { enableApi } = usePolkadot()
    useEffect(() => { enableApi() }, [])

    return (<></>)
}

export default function MyApp({ Component, pageProps }: AppProps) {
    const client = useMemo(() => new QueryClient(), [])

    return (
        <PolkadotProvider endpoint={PhalaEndpoint} originName="Phala Stakepad" registryTypes={ApiTypes}>
            <QueryClientProvider client={client}>
                <Component {...pageProps} />
            </QueryClientProvider>
            <ApiEnabler />
        </PolkadotProvider>
    )
}
