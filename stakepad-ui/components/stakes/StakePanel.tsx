import { decodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { ReactElement, useState } from 'react'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'
import { InjectedAccountSelect } from '../accounts/AccountSelect'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext />

interface DataDisplayColumnProps { address: string }

const TotalStakedColumn = (_props: DataDisplayColumnProps): ReactElement => {
    return (<LoadingSpinner />)
}

const CommissionRateColumn = ({ address }: DataDisplayColumnProps): ReactElement => {
    const { data } = useStashInfoQuery(decodeAddress(address) as AccountId)
    return data === undefined ? <LoadingSpinner /> : <>{data.payoutPrefs.commission}</>
}

export const StakePanel = ({ defaultAddress, targets }: {
    defaultAddress?: string
    targets: string[]
}): ReactElement => {
    const [, setStashAddress] = useState<string>()

    return (
        <>
            <InjectedAccountSelect
                defaultAddress={defaultAddress}
                label="Stash Account"
                onChange={address => setStashAddress(address)}
            />

            <TableBuilder data={targets}>
                <TableBuilderColumn header="矿机">
                    {(target: string) => <>{target}</>}
                </TableBuilderColumn>

                <TableBuilderColumn header="总抵押额">
                    {(target: string) => <TotalStakedColumn address={target} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="分润率">
                    {(target: string) => <CommissionRateColumn address={target} />}
                </TableBuilderColumn>
            </TableBuilder>
        </>
    )
}
