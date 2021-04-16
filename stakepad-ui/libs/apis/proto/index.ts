import { Reader } from 'protobufjs'
import { APIError } from '../errors'

export { launchpadpackage as Api } from './api'

const defaultEndpoint = process?.env?.API_ENDPOINT ?? 'https://stakepad-api-test.phala.network/1/'

type Decoder<T> = (reader: (Reader | Uint8Array), length?: number) => T

export async function requestRaw(payload: Uint8Array, endpoint?: string): Promise<ArrayBuffer> {
    const response = await fetch(endpoint ?? defaultEndpoint, {
        body: payload,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        method: 'POST'
    })

    const buffer = await response.arrayBuffer()
    return buffer
}

export async function requestDecoded<T>(payload: Uint8Array, decoder: Decoder<T>, endpoint?: string): Promise<T> {
    const buffer = await requestRaw(payload, endpoint)
    return decoder(new Uint8Array(buffer))
}

interface Response<R> {
    result?: R | null
    status?: { msg?: string | null, success?: number | null } | null
}

export async function requestSuccess<T extends Response<R>, R = T['result']>(payload: Uint8Array, decoder: Decoder<Response<R>>, endpoint?: string): Promise<NonNullable<R>> {
    const { result, status } = await requestDecoded(payload, decoder, endpoint)

    if (status === null || status === undefined) {
        throw new APIError('Status is undefined in the response')
    }

    if (status.success !== 0) {
        throw new APIError(status.msg ?? 'Unknown error', status.success ?? undefined)
    }

    if (result === null || result === undefined) {
        throw new APIError('Result is null or undefined')
    }

    return result as NonNullable<R>
}
