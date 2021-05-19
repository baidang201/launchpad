import { ApiPromise } from '@polkadot/api'
import { BalanceOf } from '@polkadot/types/interfaces'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useAddressNormalizer } from './useAddressNormalizer'

const StakerPositionsQueryKey = uuidv4()

/**
 * @param staker Account address of staker who has open stake positions to other miners
 */
export const useStakerPositionsQuery = (staker?: string, api?: ApiPromise): UseQueryResult<Record<string, BalanceOf>> => {
    const normalizeAddress = useAddressNormalizer(api)
    return useQuery(
        [StakerPositionsQueryKey, staker, api],
        async () => {
            if (staker === undefined || api === undefined) { return undefined }
            const entries = await api.query.miningStaking.staked.entries(staker)
            return Object.fromEntries(entries.map(([{ args: [, miner] }, value]) => {
                return [normalizeAddress(miner), value.unwrapOrDefault()]
            }))
        }
    )
}

/**
 * @param staker Account address of staker who stakes
 * @param miner Account address of miner for who is staked
 */
export const useStakePositionQuery = (staker?: string, miner?: string, api?: ApiPromise): BalanceOf | undefined => {
    const { data } = useStakerPositionsQuery(staker, api)
    return miner !== undefined ? data?.[miner] : undefined
}
