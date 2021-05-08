import { ApiPromise } from '@polkadot/api'
import { BalanceOf } from '@polkadot/types/interfaces'
import { encodeAddress } from '@polkadot/util-crypto'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

interface PendingStake {
    staking?: BalanceOf
    unstaking?: BalanceOf
}

const StakerPendingQueryKey = uuidv4()

export const useStakerPendingsQuery = (staker?: string, api?: ApiPromise): UseQueryResult<Record<string, PendingStake>> => {
    return useQuery(
        [StakerPendingQueryKey, staker, api],
        async () => {
            if (staker === undefined || api === undefined) { return undefined }

            const staking = await api.query.miningStaking.pendingStaking.entries(staker)
            const unstaking = await api.query.miningStaking.pendingUnstaking.entries(staker)

            const result: Record<string, PendingStake> = {}
            staking.forEach(([{ args: [, miner] }, balance]) => {
                result[encodeAddress(miner)] = { staking: balance.unwrapOrDefault() }
            })
            unstaking.forEach(([{ args: [, miner] }, balance]) => {
                const address = encodeAddress(miner)
                result[address] = {
                    ...result[address],
                    unstaking: balance.unwrapOrDefault()
                }
            })

            return result
        }
    )
}

export const useStakePendingQuery = (staker?: string, miner?: string, api?: ApiPromise): PendingStake | undefined => {
    const { data } = useStakerPendingsQuery(staker, api)
    return miner !== undefined ? data?.[miner] : undefined
}
