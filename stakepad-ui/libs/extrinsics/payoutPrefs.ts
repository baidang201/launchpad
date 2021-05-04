import { ApiPromise } from '@polkadot/api'
import { ExtrinsicStatus, withWeb3 } from '../polkadot/extrinsics'
import { AccountId, Hash } from '@polkadot/types/interfaces'
import { numberToU8a } from '@polkadot/util'

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
        extrinsic: api.tx.phala.setPayoutPrefs(numberToU8a(commissionRate), target)
    })
}
