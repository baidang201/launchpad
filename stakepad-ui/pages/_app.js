import '../styles/globals.css'
import '../styles/antd.less'
import { PolkadotProvider, usePolkadot } from '../libs/polkadot/context'

function MyApp({ Component, pageProps }) {
  return (
    <PolkadotProvider>
      <Component {...pageProps} />
    </PolkadotProvider>
  )
}

export default MyApp
