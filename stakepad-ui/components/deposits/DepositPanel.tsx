import { AccountId, BalanceOf } from '@polkadot/types/interfaces'
import { } from '@polkadot/util'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto/address'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Alert as AlertIcon, Check as CheckIcon } from 'baseui/icon'
import { Input } from 'baseui/input'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { ALIGN as RadioGroupAlign, Radio, RadioGroup } from 'baseui/radio'
import BN from 'bn.js'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { deposit, withdraw } from '../../libs/extrinsics/deposit'
import { useApiPromise, useWeb3 } from '../../libs/polkadot'
import { ExtrinsicStatus } from '../../libs/polkadot/extrinsics'
import { useAccountQuery } from '../../libs/queries/useAccountQuery'
import { useDepositQuery } from '../../libs/queries/useBalanceQuery'
import { InjectedAccountSelect } from '../accounts/AccountSelect'
import { ExtrinsicStatusNotification } from '../extrinsics/ExtrinsicStatusNotification'

const LoadingText = (): ReactElement => <>Loading...</>

export const DepositPanel = ({ defaultAddress, defaultMode }: {
    defaultAddress?: string
    defaultMode?: 'deposit' | 'withdraw'
}): ReactElement => {
    // stash account to deposit to or withdraw from
    const [address, setAddress] = useState<string | undefined>(defaultAddress)
    const accountId = useMemo(() => { try { return decodeAddress(address) as AccountId } catch { return undefined } }, [address])

    // amount of deposit/withdraw
    const [amount, setAmount] = useState<number>()

    const [mode, setMode] = useState<'deposit' | 'withdraw'>(defaultMode ?? 'deposit')

    // on-chain status
    const { data: accountInfo } = useAccountQuery(accountId)
    const { data: depositBalance } = useDepositQuery(accountId)

    // client status
    const { api, readystate: apiReadystate } = useApiPromise()
    const { readystate: web3Readystate } = useWeb3()

    const accountSelectCaption = useMemo(() => {
        switch (accountId !== undefined && mode) {
            case 'deposit':
                return <>钱包余额: {accountInfo?.data.free.toHuman() ?? <LoadingText />}</>
            case 'withdraw':
                return <>挖矿储值: {depositBalance?.toHuman() ?? <LoadingText />}</>
            default:
                return <>选择一个账户</>
        }
    }, [accountId, accountInfo?.data.free, depositBalance, mode])

    // error description of last extrinsic
    const [lastError, setLastError] = useState<string>()
    const lastErrorNotification = useMemo(() => {
        return lastError === undefined ? <></> : <Notification kind={NotificationKind.negative}><AlertIcon />{lastError}</Notification>
    }, [lastError])

    // status of currently ongoing extrinsic
    const [extrinsicStatus, setExtrinsicStatus] = useState<ExtrinsicStatus>()
    const extrinsicStatusNotification = useMemo(() => <ExtrinsicStatusNotification status={extrinsicStatus} />, [extrinsicStatus])

    const ready = useMemo(() => (
        accountId !== undefined &&
        typeof amount === 'number' &&
        apiReadystate === 'ready' &&
        web3Readystate === 'ready'
    ), [accountId, amount, apiReadystate, web3Readystate])

    // set to default address on first mount
    useEffect(() => setAddress(defaultAddress), [defaultAddress])

    const handleAmountChange = (newValue: string): void => {
        setAmount(/^\d+(\.\d{0,4})?$/.test(newValue) ? parseFloat(newValue) : undefined)
    }

    const handleSubmit = (): void => {
        if (accountId === undefined || amount === undefined || api === undefined) { return }

        setLastError(undefined);
        ({ deposit, withdraw })[mode]({
            account: encodeAddress(accountId),
            api,
            statusCallback: (status: ExtrinsicStatus) => { setExtrinsicStatus(status) },
            value: new BN(amount * 1e4).mul(new BN(1e8)) as BalanceOf
        }).catch(error => {
            setExtrinsicStatus('invalid')
            setLastError((error as Error)?.message ?? error)
        })
    }

    return (
        <>
            <InjectedAccountSelect
                caption={accountSelectCaption}
                defaultAddress={defaultAddress}
                error={accountId === undefined}
                label="Stash Account"
                onChange={address => setAddress(address === undefined ? undefined : address)}
            />

            <RadioGroup align={RadioGroupAlign.horizontal} onChange={e => setMode(e.target.value as any)} value={mode}>
                <Radio value="deposit">存入</Radio>
                <Radio value="withdraw">取出</Radio>
            </RadioGroup>

            <FormControl>
                <Input
                    error={amount === undefined}
                    endEnhancer={() => <span>PHA</span>}
                    onChange={e => handleAmountChange(e.currentTarget.value)}
                />
            </FormControl>

            <Button disabled={!ready} onClick={() => handleSubmit()} startEnhancer={<CheckIcon />}>提交</Button>

            {lastErrorNotification}

            {extrinsicStatusNotification}

            {apiReadystate !== 'ready' && <Notification kind={NotificationKind.negative}>Waiting for connection to Phala network</Notification>}
            {web3Readystate !== 'ready' && <Notification kind={NotificationKind.negative}>Waiting for Polkadot.js browser extension</Notification>}
        </>
    )
}
