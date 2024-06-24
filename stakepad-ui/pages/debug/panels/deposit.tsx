import { validateAddress } from '@polkadot/util-crypto'
import { Card, CardOverrides } from 'baseui/card'
import { useRouter } from 'next/router'
import { ReactElement, useMemo } from 'react'
import { DepositPanel } from '../../../components/deposits/DepositPanel'

export const PanelPage = (defaultMode: 'deposit' | 'withdraw') => function DepositFundPanelPage(): ReactElement {
    const cardOverrides: CardOverrides = {
        Root: {
            style: {
                margin: '2em auto',
                maxWidth: '32em'
            }
        }
    }

    const { query: { address } } = useRouter()

    const defaultAddress = useMemo(() => {
        try {
            return (typeof address === 'string' && validateAddress(address)) ? address : undefined
        } catch {
            return undefined
        }
    }, [address])

    return (
        <Card overrides={cardOverrides}>
            <DepositPanel defaultAddress={defaultAddress} defaultMode={defaultMode} />
        </Card>
    )
}

export default PanelPage('deposit')
