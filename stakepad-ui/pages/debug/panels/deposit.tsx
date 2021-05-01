import { ReactElement } from 'react'
import { DepositPanel } from '../../../components/deposits/DepositPanel'
import { Card, CardOverrides } from 'baseui/card'

const DepositFundPanelPage = (): ReactElement => {
    const cardOverrides: CardOverrides = {
        Root: {
            style: {
                margin: '2em auto',
                maxWidth: '32em'
            }
        }
    }

    return (
        <Card overrides={cardOverrides}>
            <DepositPanel />
        </Card>
    )
}

export default DepositFundPanelPage
