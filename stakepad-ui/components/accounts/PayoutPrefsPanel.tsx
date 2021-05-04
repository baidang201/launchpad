import { Check as CheckIcon } from 'baseui/icon';
import { Button } from 'baseui/button'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { FormControl } from 'baseui/form-control'
import { Radio, RadioGroup } from 'baseui/radio'
import React, { ReactElement, ReactNode, useMemo, useState } from 'react'
import { useApiPromise } from '../../libs/polkadot'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'
import { ValidatedAccountInput } from './AccountInput'
import { InjectedAccountSelect } from './AccountSelector'
import { Input } from 'baseui/input';
import { ExtrinsicStatus } from '../../libs/polkadot/extrinsics';

export const PayoutPrefsPanel = (): ReactElement => {
    const { api } = useApiPromise()

    /* current states */

    const [account, setAccount] = useState<string>()
    const accountId = useMemo(() => account === undefined ? undefined : decodeAddress(account) as AccountId, [account])
    const { data: stashInfo } = useStashInfoQuery(accountId, api)
    const currentPayoutTarget = useMemo(() => stashInfo === undefined ? undefined : encodeAddress(stashInfo.payoutPrefs.target), [stashInfo])

    const [mode, setMode] = useState<'keep' | 'stash' | 'select' | 'input'>('keep')

    /* target stashInfo */

    const [newPayoutTarget, setNewPayoutTarget] = useState<string>()
    // const [newCommissionRate, setNewCommissionRate] = useState<number>()

    /* display */

    const accountSelectCaption = useMemo<ReactNode>(() => (
        <>{account === undefined ? '选择一个账户' : undefined}</>
    ), [account])

    const extrinsicStatus = useState<ExtrinsicStatus>()

    /* handlers */

    const handleModeChange = (value: string): void => { setMode(value as any) }

    const handleSubmit = () => { }

    return (
        <>
            <InjectedAccountSelect
                caption={accountSelectCaption}
                error={account === undefined}
                label="Stash Account"
                onChange={account => setAccount(account)}
            />

            <FormControl label="收益地址">
                <RadioGroup onChange={e => handleModeChange(e.target.value)} value={mode}>
                    <Radio
                        description={account === undefined ? undefined : currentPayoutTarget ?? 'Loading...'}
                        value="keep"
                    >保持不变</Radio>
                    <Radio description={account} value="stash">使用 Stash 账户</Radio>
                    <Radio value="select">选择一个已添加的账户</Radio>
                    <Radio value="input">使用一个指定的地址</Radio>
                </RadioGroup>
            </FormControl>

            <FormControl label="分润率">
                <Input disabled value={stashInfo?.payoutPrefs.commission.toString()} />
            </FormControl>

            {mode === 'select' && (
                <InjectedAccountSelect
                    error={newPayoutTarget === undefined}
                    onChange={account => setNewPayoutTarget(account)}
                />
            )}

            {mode === 'input' && (
                <ValidatedAccountInput onChange={account => setNewPayoutTarget(account)} />
            )}

            <Button onClick={handleSubmit} startEnhancer={<CheckIcon />}>Submit</Button>
        </>
    )
}
