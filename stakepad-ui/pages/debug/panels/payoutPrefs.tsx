import { validateAddress } from '@polkadot/util-crypto'
import { useRouter } from 'next/router'
import { ReactElement, useMemo } from 'react'
import { PayoutPrefsPanel } from '../../../components/accounts/PayoutPrefsPanel'

const PayoutPrefsPage = (): ReactElement => {
    const { query: { address } } = useRouter()

    const defaultAddress = useMemo(() => {
        try {
            return (typeof address === 'string' && validateAddress(address)) ? address : undefined
        } catch {
            return undefined
        }
    }, [address])

    return (
        <PayoutPrefsPanel defaultAddress={defaultAddress} />
    )
}

export default PayoutPrefsPage
