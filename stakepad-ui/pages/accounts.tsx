import { ApiPromise } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { AccountId } from '@polkadot/types/interfaces'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { ReactElement, useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { usePolkadot } from '../libs/polkadot'
import { StashInfo } from '../libs/polkadot/interfaces'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $size={SpinnerSize.small} />

const useQueryStashState = (accountId: AccountId, api?: ApiPromise): UseQueryResult<StashInfo | undefined> => useQuery(
    ['polkadot', 'query', 'phala', 'stashState', accountId, api === undefined], async () => {
        const result = await api?.query.phala.stashState(accountId)
        // console.log('account=', encodeAddress(accountId), ', result.isEmpty=', result?.isEmpty)
        // console.log(result)
        // console.log(result?.payoutPrefs.target.toHex())
        return result
    }
)

const StashStateColumn = ({ accountId, children }: {
    accountId: AccountId
    children: (info: StashInfo) => ReactElement<any>
}): ReactElement => {
    const { api } = usePolkadot()
    const { data: stashState } = useQueryStashState(accountId, api)

    return stashState !== undefined ? children(stashState) : <LoadingSpinner />
}

const WalletBalance = ({ accountId }: { accountId: AccountId }): ReactElement<any> => {
    const { api } = usePolkadot()
    const { data: balance } = useQuery(
        ['polkadot', 'query', 'miningStaking', 'wallet', accountId, api === undefined], async () => {
            const result = await api?.query.miningStaking.wallet(accountId)
            console.log('account=', encodeAddress(accountId), ', result=', result)
            return result?.unwrapOr(undefined)
        }
    )

    return balance === undefined ? (<LoadingSpinner />) : <>{balance}</>
}

const Accounts = (): ReactElement => {
    const { accounts, readystate } = usePolkadot()

    const accountIds: AccountId[] = useMemo(() => accounts?.map(account => {
        return decodeAddress(account.address) as AccountId
    }) ?? [], [accounts])

    return (
        <>
            <TableBuilder
                data={accountIds}
                emptyMessage="没有账号"
                isLoading={readystate !== 'ready'}
                loadingMessage="读取中"
            >
                <TableBuilderColumn header="账户">{(accountId: AccountId) => encodeAddress(accountId)}</TableBuilderColumn>

                <TableBuilderColumn header="收益地址">
                    {(accountId: AccountId) => (
                        <StashStateColumn accountId={accountId}>{({ payoutPrefs: { target } }) => {
                            return <>{target.isEmpty ? 'n/a' : encodeAddress(target)}</>
                        }}</StashStateColumn>)}
                </TableBuilderColumn>

                <TableBuilderColumn header="账户钱包余额">
                    {(accountId: AccountId) => <WalletBalance accountId={accountId} />}
                </TableBuilderColumn>

                <TableBuilderColumn header="挖矿储值余额">{() => <LoadingSpinner />}</TableBuilderColumn>
                <TableBuilderColumn header="抵押总额">{() => <LoadingSpinner />}</TableBuilderColumn>
                <TableBuilderColumn header="抵押机器数量">{() => <LoadingSpinner />}</TableBuilderColumn>
            </TableBuilder>
        </>
    )
}

export default Accounts
