import { ApiPromise } from '@polkadot/api'
import { AccountId, Balance, Hash } from '@polkadot/types/interfaces'
import { encodeAddress } from '@polkadot/util-crypto'
import { ExtrinsicStatus, signAndSend, web3FromAddress } from '../polkadot/extrinsics'

interface StakeBatchProps {
    api: ApiPromise
    batch: Array<[string, 'stake' | 'unstake', Balance]>
    staker: AccountId | string
    statusCallback: (status: ExtrinsicStatus) => void
}
export const stakeBatch = async ({ api, batch, staker, statusCallback }: StakeBatchProps): Promise<Hash> => {
    const stakeExtrinsics = batch.map(([miner, type, offset]) => {
        switch (type) {
            case 'stake':
                return api.tx.miningStaking.stake(miner, offset)
            case 'unstake':
                return api.tx.miningStaking.unstake(miner, offset)
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
        statusCallback: (status) => { statusCallback(status) }
    })
}
