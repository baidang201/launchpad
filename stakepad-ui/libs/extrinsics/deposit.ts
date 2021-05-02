import { ApiPromise } from '@polkadot/api'
import { BalanceOf, Hash } from '@polkadot/types/interfaces'
import { ExtrinsicStatus, withWeb3 } from '../polkadot/extrinsics'

export const deposit = async (props: {
    account: string
    api: ApiPromise
    statusCallback: (status: ExtrinsicStatus) => void
    value: BalanceOf
}): Promise<Hash> => {
    const { api, value } = props
    return await withWeb3({ ...props, extrinsic: api.tx.miningStaking.deposit(value) })
}

export const withdraw = async (props: {
    account: string
    api: ApiPromise
    statusCallback: (status: ExtrinsicStatus) => void
    value: BalanceOf
}): Promise<Hash> => {
    const { api, value } = props
    return await withWeb3({ ...props, extrinsic: api.tx.miningStaking.withdraw(value) })
}
