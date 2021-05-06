import { ApiPromise } from '@polkadot/api'
import { BalanceOf } from '@polkadot/types/interfaces'
import { encodeAddress } from '@polkadot/util-crypto'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

type StakedByResult = Record<string, BalanceOf>

const queryKey = uuidv4()

/**
 * @param address the account who sent stakes to other accounts
 */
export const useStakedByQuery = (address?: string, api?: ApiPromise): UseQueryResult<StakedByResult> => {
    return useQuery(
        [queryKey, address, api],
        async () => {
            if (address === undefined || api === undefined) return undefined
            // TODO: add pending stakes
            const entries = await api.query.miningStaking.staked.entries(address)
            return entries.reduce<Record<string, BalanceOf>>((records, [{ args: [, stakee] }, value]) => {
                records[encodeAddress(stakee)] = value.unwrapOrDefault()
                return records
            }, {})
        }
    )
}
