import { AccountId, BalanceOf } from '@polkadot/types/interfaces'
import { } from '@polkadot/util'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto/address'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Alert as AlertIcon, Check as CheckIcon } from 'baseui/icon'
import { Input } from 'baseui/input'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { ALIGN as RadioGroupAlign, Radio, RadioGroup } from 'baseui/radio'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import BN from 'bn.js'
import React, { ReactElement, useMemo, useState } from 'react'
import { deposit, withdraw } from '../../libs/extrinsics/deposit'
import { useApiPromise, useWeb3 } from '../../libs/polkadot'
import { ExtrinsicStatus } from '../../libs/polkadot/extrinsics'
import { useAccountQuery } from '../../libs/queries/useAccountQuery'
import { useDepositQuery } from '../../libs/queries/useBalanceQuery'
import { AccountSelect } from '../accounts/AccountSelector'

const LoadingText = (): ReactElement => <>Loading...</>
const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $as="span" $size={SpinnerSize.small} />

export const DepositPanel = ({ defaultAccount, defaultMode }: {
    defaultAccount?: AccountId
    defaultMode?: 'deposit' | 'withdraw'
}): ReactElement => {
    const [accountId, setAccountId] = useState<AccountId | undefined>(defaultAccount ?? undefined)
    const [amount, setAmount] = useState<number>()
    const [lastError, setLastError] = useState<string>()
    const [mode, setMode] = useState<'deposit' | 'withdraw'>(defaultMode ?? 'deposit')
    const [extrinsicStatus, setExtrinsicStatus] = useState<ExtrinsicStatus>()

    const { data: accountInfo } = useAccountQuery(accountId)
    const { data: depositBalance } = useDepositQuery(accountId)
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

    const extrinsicStatusNotification = useMemo(() => {
        switch (extrinsicStatus) {
            case undefined:
                return <></>
            case 'localSign':
                return <Notification kind={NotificationKind.warning}><LoadingSpinner /> 等待浏览器扩展签名</Notification>
            case 'broadcast':
                return <Notification kind={NotificationKind.info}><LoadingSpinner /> 交易发送中</Notification>
            case 'inBlock':
                return <Notification kind={NotificationKind.info}><LoadingSpinner /> 交易等待进入区块</Notification>
            case 'finalized':
                return <Notification kind={NotificationKind.positive}><CheckIcon /> 交易完成</Notification>
            default:
                return <Notification kind={NotificationKind.negative}><AlertIcon /> 交易失败或异常</Notification>
        }
    }, [extrinsicStatus])

    const lastErrorNotification = useMemo(() => {
        return lastError === undefined ? <></> : <Notification kind={NotificationKind.negative}><AlertIcon />{lastError}</Notification>
    }, [lastError])

    const ready = useMemo(() => (
        accountId !== undefined &&
        typeof amount === 'number' &&
        apiReadystate === 'ready' &&
        web3Readystate === 'ready'
    ), [accountId, amount, apiReadystate, web3Readystate])

    const handleAmountChange = (newValue: string): void => {
        setAmount(/^\d+(\.\d{0,4})?$/.test(newValue) ? parseFloat(newValue) : undefined)
    }

    const handleSubmit = (): void => {
        if (accountId === undefined || amount === undefined || api === undefined) { return }

        setLastError(undefined);
        ({ deposit, withdraw })[mode]({
            account: encodeAddress(accountId),
            api,
            statusCallback: (status: ExtrinsicStatus) => {
                console.log('extrinsic status=', status)
                setExtrinsicStatus(status)
            },
            value: new BN(amount * 1e4).mul(new BN(1e8)) as BalanceOf
        }).catch(error => {
            setExtrinsicStatus('invalid')
            setLastError((error as Error)?.message ?? error)
        })
    }

    return (
        <>
            <AccountSelect
                caption={accountSelectCaption}
                error={accountId === undefined}
                label="Stash Account"
                onChange={address => setAccountId(address === undefined ? undefined : decodeAddress(address) as AccountId)}
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
