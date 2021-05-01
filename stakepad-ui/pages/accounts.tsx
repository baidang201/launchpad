import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { PropsWithChildren, ReactElement, useMemo } from 'react'
import { useApiPromise, useWeb3 } from '../libs/polkadot'
import { useAccountQuery } from '../libs/queries/useAccountQuery'
import { useDepositQuery } from '../libs/queries/useBalanceQuery'
import { useStashInfoQuery } from '../libs/queries/useStashInfoQuery'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $size={SpinnerSize.small} />

const LoadingColumn = ({ children }: PropsWithChildren<{}>): ReactElement => {
    if (children === undefined) {
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
    const target = data?.payoutPrefs.target
    if (target !== undefined) {
        return (<LoadingColumn>{encodeAddress(target)}</LoadingColumn>)
    } else {
        return (<LoadingColumn />)
    }
}

const AccountBalanceColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { data: account } = useAccountQuery(accountId)
    return (<LoadingColumn>{account?.data.free.toHuman()}</LoadingColumn>)
}

const DepositBalanceColumn = ({ accountId }: { accountId: AccountId }): ReactElement => {
    const { data } = useDepositQuery(accountId)
    return (<LoadingColumn>{data?.toHuman()}</LoadingColumn>)
}

const Accounts = (): ReactElement => {
    const { accounts, readystate: web3Readystate } = useWeb3()

    const accountIds = useMemo(() => accounts?.map(account => decodeAddress(account.address)) ?? [], [accounts])

    return (
        <>
            <TableBuilder
                data={accountIds}
                emptyMessage="没有账号"
                isLoading={web3Readystate !== 'ready'}
                loadingMessage="正在等待 polkadot{.js} 浏览器扩展"
            >
                <TableBuilderColumn header="账户">
                    {(accountId: AccountId) => encodeAddress(accountId)}
                </TableBuilderColumn>

                <TableBuilderColumn header="收益地址">
                    {(accountId: AccountId) => <PayoutAddressColumn accountId={accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="账户钱包余额">
                    {(accountId: AccountId) => <AccountBalanceColumn accountId={accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="挖矿储值余额">
                    {(accountId: AccountId) => <DepositBalanceColumn accountId={accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="抵押总额">
                    {() => <LoadingSpinner />}
                </TableBuilderColumn>

                <TableBuilderColumn header="抵押机器数量">
                    {() => <LoadingSpinner />}
                </TableBuilderColumn>
            </TableBuilder>
        </>
    )
}

export default Accounts
