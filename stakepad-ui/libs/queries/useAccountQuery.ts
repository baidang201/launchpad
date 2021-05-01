import { AccountId, AccountInfo } from '@polkadot/types/interfaces'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useApiPromise } from '../polkadot'

const queryKey = uuidv4()

export function useAccountQuery(accountId?: AccountId): UseQueryResult<AccountInfo> {
    const { api } = useApiPromise()
    return useQuery(
        [queryKey, accountId, api],
        async () => accountId !== undefined ? await api?.query.system.account(accountId) : undefined
    )
}
