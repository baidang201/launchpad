import { ApiPromise } from '@polkadot/api'
import { AccountId } from '@polkadot/types/interfaces'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { StashInfo } from '../polkadot/interfaces'

const useStashInfoQueryId = uuidv4()

export const useStashInfoQuery = (account?: AccountId | string, api?: ApiPromise): UseQueryResult<StashInfo> => {
    return useQuery(
        [useStashInfoQueryId, account, api],
        async () => account === undefined ? undefined : await api?.query.phala.stashState(account)
    )
}
