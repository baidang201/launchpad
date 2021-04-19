import { Reader } from 'protobufjs'

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
