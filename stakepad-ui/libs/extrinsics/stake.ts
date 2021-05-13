import { ApiPromise } from '@polkadot/api'
import { AccountId, BalanceOf, Hash } from '@polkadot/types/interfaces'
import { encodeAddress } from '@polkadot/util-crypto'
import { signAndSend, web3FromAddress } from '../polkadot/extrinsics'

interface StakeBatchProps {
    api: ApiPromise
    batch: Record<string, ['stake' | 'unstake', BalanceOf]>
    staker: AccountId | string
}
export const stakeBatch = async ({ api, batch, staker }: StakeBatchProps): Promise<Hash> => {
    const stakeExtrinsics = Object.entries(batch).map(([miner, [type, balance]]) => {
        switch (type) {
            case 'stake':
                return api.tx.miningStaking.stake(miner, balance)
            case 'unstake':
                return api.tx.miningStaking.unstake(miner, balance)
            default:
                throw new Error(`Unsupported stake type: ${type as string}`)
        }
    })
    const batchExtrinsic = api.tx.utility.batchAll(stakeExtrinsics)

    const { signer } = await web3FromAddress(typeof staker === 'string' ? staker : encodeAddress(staker))

    return await signAndSend({
        account: staker,
        api,
        extrinsic: batchExtrinsic,
        signer,
        statusCallback: (status) => { console.info('batch extrinsic status=', status) }
    })
}
