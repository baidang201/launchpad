import { ApiPromise } from '@polkadot/api'
import { encodeAddress } from '@polkadot/keyring'
import { AccountId, Hash } from '@polkadot/types/interfaces'
import { ExtrinsicStatus, withWeb3 } from '../polkadot/extrinsics'

export const setPayoutPrefs = async (props: {
    account: string
    api: ApiPromise
    commissionRate: number
    statusCallback: (status: ExtrinsicStatus) => void
    target: AccountId
}): Promise<Hash> => {
    const { api, commissionRate, target } = props

    return await withWeb3({
        ...props,
        extrinsic: api.tx.phala.setPayoutPrefs(commissionRate as any, encodeAddress(target))
    })
}
