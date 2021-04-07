import { AppProps } from 'next/dist/next-server/lib/router/router'
import { PolkadotProvider } from '../libs/polkadot/context'
import { endpoint as PhalaEndpoint } from '../utils/polkadot'
import '../styles/antd.less'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <PolkadotProvider endpoint={PhalaEndpoint}>
            <Component {...pageProps} />
        </PolkadotProvider>
    )
}
