import { decodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { ALIGN as RadioGroupAlign, Radio, RadioGroup } from 'baseui/radio'
import React, { ReactElement, useMemo, useState } from 'react'
import { useAccountQuery } from '../../libs/queries/useAccountQuery'
import { useDepositQuery } from '../../libs/queries/useBalanceQuery'
import { AccountSelect } from '../accounts/AccountSelector'

// const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $as="span" $size={SpinnerSize.small} />
const LoadingSpinner = (): ReactElement => <>Loading...</>

export const DepositPanel = (): ReactElement => {
    const [accountId, setAccountId] = useState<AccountId>()
    const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')

    const { data: accountInfo } = useAccountQuery(accountId)
    const { data: depositBalance } = useDepositQuery(accountId)

    const accountSelectCaption = useMemo(() => {
        switch (accountId !== undefined && mode) {
            case 'deposit':
                return <>钱包余额: {accountInfo?.data.free.toHuman() ?? <LoadingSpinner />}</>
            case 'withdraw':
                return <>挖矿储值: {depositBalance?.toHuman() ?? <LoadingSpinner />}</>
            default:
                return <>选择一个账户</>
        }
    }, [accountId, accountInfo?.data.free, depositBalance, mode])

    return (
        <>
            <AccountSelect
                caption={accountSelectCaption}
                label="Stash Account"
                onChange={address => setAccountId(address === undefined ? undefined : decodeAddress(address) as AccountId)}
            />

            <RadioGroup align={RadioGroupAlign.horizontal} onChange={e => setMode(e.target.value as any)} value={mode}>
                <Radio value="deposit">存入</Radio>
                <Radio value="withdraw">取出</Radio>
            </RadioGroup>

            <FormControl>
                <Input endEnhancer={() => <span>PHA</span>} />
            </FormControl>
        </>
    )
}
