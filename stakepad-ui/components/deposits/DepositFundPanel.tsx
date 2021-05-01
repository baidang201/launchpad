import { decodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import React, { ReactElement, useState } from 'react'
import { useAccountQuery } from '../../libs/queries/useAccountQuery'
import { AccountSelect } from '../accounts/AccountSelector'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $size={SpinnerSize.small} />

export const DepositFundPanel = (): ReactElement => {
    const [accountId, setAccountId] = useState<AccountId>()
    const { data } = useAccountQuery(accountId)

    const onAccountSelectChange = (address?: string): void => {
        try {
            const newAccount = decodeAddress(address) as AccountId
            setAccountId(newAccount)
        } catch { }
    }

    return (
        <>
            <AccountSelect onChange={onAccountSelectChange} />
            {accountId !== undefined && <>钱包储值：{data?.data.free.toHuman() ?? <LoadingSpinner />}</>}
        </>
    )
}
