import { decodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { Button, KIND as ButtonKind, SIZE as ButtonSize } from 'baseui/button'
import { Overflow as OverflowIcon } from 'baseui/icon'
import { ItemT, StatefulMenu } from 'baseui/menu'
import { StatefulPopover } from 'baseui/popover'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { useRouter } from 'next/router'
import React, { PropsWithChildren, ReactElement, useMemo } from 'react'
import { useApiPromise, useWeb3 } from '../../libs/polkadot'
import { useAccountQuery } from '../../libs/queries/useAccountQuery'
import { useAddressNormalizer } from '../../libs/queries/useAddressNormalizer'
import { useDepositQuery } from '../../libs/queries/useBalanceQuery'
import { useStakerPendingTotalQuery } from '../../libs/queries/usePendingStakeQuery'
import { useStakerPositionTotalQuery } from '../../libs/queries/useStakeQuery'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $size={SpinnerSize.small} />

const LoadingColumn = ({ children }: PropsWithChildren<{}>): ReactElement => {
    if (children === undefined || children === false) {
        return (<LoadingSpinner />)
    }

    if (children === null) {
        return (<>n/a</>)
    }

    return <>{children}</>
}

const PayoutAddressColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { api } = useApiPromise()
    const { data } = useStashInfoQuery(accountId, api)
    const normalizeAddress = useAddressNormalizer(api)

    const target = data?.payoutPrefs.target
    const normalized = useMemo(() => target !== undefined && normalizeAddress(target), [normalizeAddress, target])

    return (<LoadingColumn>{normalized}</LoadingColumn>)
}

const AccountBalanceColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { data: account } = useAccountQuery(accountId)
    return (<LoadingColumn>{account?.data.free.toHuman()}</LoadingColumn>)
}

const DepositBalanceColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { data } = useDepositQuery(accountId)
    return (<LoadingColumn>{data?.toHuman()}</LoadingColumn>)
}

const StakerPositionTotalColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { api } = useApiPromise()
    const positions = useStakerPositionTotalQuery(accountId, api)
    const pendings = useStakerPendingTotalQuery(accountId, api)

    const pendingSign = pendings?.balance.isPositive() === true ? '+' : ''
    const pendingText = pendings?.balance.isZero() === false ? ` (${pendingSign}${pendings.balance.toString()} pending)` : ''
    return (
        <LoadingColumn>
            {(positions !== undefined) && (`${positions.balance.toString()}${pendingText} PHA`)}
        </LoadingColumn>
    )
}

const StakerPositionCountColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { api } = useApiPromise()
    const positions = useStakerPositionTotalQuery(accountId, api)
    const pendings = useStakerPendingTotalQuery(accountId, api)

    const pendingText = pendings !== undefined && pendings.count > 0 ? ` (${pendings.count} pending)` : ''
    return (<LoadingColumn>{(positions !== undefined) && `${positions.count.toString()}${pendingText}`}</LoadingColumn>)
}

interface OperationItemMenuItem {
    action: () => void
    label: string
}

const OperationMenu = ({ address }: { address: string }): ReactElement => {
    const { push } = useRouter()

    const items: ItemT[] = [{
        action: () => { push(`/debug/panels/deposit?address=${address}`).catch(() => { }) },
        label: '储值'
    }, {
        action: () => { push(`/debug/panels/withdraw?address=${address}`).catch(() => { }) },
        label: '提取'
    }, {
        action: () => { push(`/debug/panels/payoutPrefs?address=${address}`).catch(() => { }) },
        label: '收益偏好'
    }, {
        action: () => { push(`/accounts/${address}/stakes`).catch(() => { }) },
        label: '抵押列表'
    }]

    const handleItemSelect = (item: OperationItemMenuItem, close: () => void): void => {
        item.action()
        close()
    }

    return (
        <StatefulPopover content={({ close }) => (
            <StatefulMenu items={items} onItemSelect={({ item }) => handleItemSelect(item as unknown as OperationItemMenuItem, close)} />
        )} placement="auto" >
            <Button kind={ButtonKind.minimal} size={ButtonSize.mini} startEnhancer={<OverflowIcon />} />
        </StatefulPopover >
    )
}

interface AccountTableItem {
    accountId: AccountId
    address: string
}

const Accounts = (): ReactElement => {
    const { api } = useApiPromise()
    const { accounts, readystate: web3Readystate } = useWeb3()
    const normalizeAddress = useAddressNormalizer(api)

    const accountIds = useMemo<AccountTableItem[]>(() => (
        accounts?.map(account => ({
            accountId: decodeAddress(account.address) as AccountId,
            address: normalizeAddress(account.address)
        })) ?? []
    ), [accounts, normalizeAddress])

    return (
        <>
            <TableBuilder
                data={accountIds}
                emptyMessage="没有账号"
                isLoading={web3Readystate !== 'ready'}
                loadingMessage="正在等待 polkadot{.js} 浏览器扩展"
            >
                <TableBuilderColumn header="账户">
                    {(item: AccountTableItem) => item.address}
                </TableBuilderColumn>

                <TableBuilderColumn header="收益地址">
                    {(item: AccountTableItem) => <PayoutAddressColumn accountId={item.accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="账户钱包余额">
                    {(item: AccountTableItem) => <AccountBalanceColumn accountId={item.accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="挖矿储值余额">
                    {(item: AccountTableItem) => <DepositBalanceColumn accountId={item.accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="抵押总额">
                    {(item: AccountTableItem) => <StakerPositionTotalColumn accountId={item.accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="抵押机器数量">
                    {(item: AccountTableItem) => <StakerPositionCountColumn accountId={item.accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn>
                    {(item: AccountTableItem) => <OperationMenu address={item.address} />}
                </TableBuilderColumn>
            </TableBuilder>
        </>
    )
}

export default Accounts
