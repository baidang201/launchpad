import { ApiPromise } from '@polkadot/api'
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types'
import { encodeAddress } from '@polkadot/keyring'
import { AccountId, DispatchError, Hash } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'

export type ExtrinsicStatus = 'localSign' | 'broadcast' | 'inBlock' | 'finalized' | 'invalid'

class SimpleExtrinsicFailedError extends Error {
    constructor(error: string) {
        super(`Extrinsic Failed: ${error}`)
    }
}

class ExtrinsicFailedError extends SimpleExtrinsicFailedError {
    constructor(section: string, method: string, documentation: string[]) {
        super(`Extrinsic Failed: ${section}.${method}: ${documentation.join(' ')}`)
    }
}

class ExtrinsicSendError extends Error { }

interface SignAndSendProps<ApiType extends 'promise' = 'promise', R extends ISubmittableResult = ISubmittableResult> {
    api: ApiPromise
    extrinsic: SubmittableExtrinsic<ApiType, R>

    account: AccountId | string
    signer?: Signer

    statusCallback?: (status: ExtrinsicStatus) => void
}

export async function signAndSend({ account, api, extrinsic, signer, statusCallback }: SignAndSendProps): Promise<Hash> {
    const extrinsicPromise = new Promise<Hash>((resolve, reject) => {
        extrinsic.signAndSend(account, { signer }, result => {
            if (result.status.isBroadcast) {
                statusCallback?.('broadcast')
            }

            if (result.status.isInBlock) {
                statusCallback?.('inBlock')
            }

            if (result.status.isFinalized) {
                const failure = result.events.filter((e) => {
                    // https://polkadot.js.org/docs/api/examples/promise/system-events
                    return api.events.system.ExtrinsicFailed.is(e.event)
                })[0]

                if (failure !== undefined) {
                    const { event: { data: [error] } } = failure
                    if ((error as DispatchError)?.isModule?.valueOf()) {
                        // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
                        const decoded = api.registry.findMetaError((error as DispatchError).asModule)
                        const { documentation, method, section } = decoded

                        reject(new ExtrinsicFailedError(section, method, documentation))
                    } else {
                        reject(new SimpleExtrinsicFailedError(error?.toString() ?? toString.call(error)))
                    }
                }

                resolve(result.status.hash)
                statusCallback?.('finalized')
            }

            if (result.status.isInvalid) {
                reject(new SimpleExtrinsicFailedError('Invalid transaction'))
                statusCallback?.('invalid')
            }
        }).then(unsubscribe => {
            extrinsicPromise.finally(() => unsubscribe())
        }).catch(reason => {
            reject(new ExtrinsicSendError((reason as Error)?.message ?? reason))
        })
    })

    return await extrinsicPromise
}

export async function withWeb3(props: SignAndSendProps): Promise<Hash> {
    const { account, statusCallback } = props

    statusCallback?.('localSign')
    const { web3FromAddress } = await import('@polkadot/extension-dapp')
    const web3 = await web3FromAddress(encodeAddress(account))

    return await signAndSend({ ...props, signer: web3.signer })
}
