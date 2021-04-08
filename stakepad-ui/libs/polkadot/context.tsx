import { ApiPromise, WsProvider } from '@polkadot/api'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { RegistryTypes } from '@polkadot/types/types'
import React, { useContext, useRef, useState } from 'react'
import { IPolkadotContext, PolkadotReadystate } from '.'

const PolkadotContext = React.createContext<IPolkadotContext>({
    accounts: undefined,
    api: undefined,
    readystate: 'start',

    account: undefined,
    setAccount: () => { throw new Error('Not implemented') },

    enableApi: () => { throw new Error('Not implemented') },
    enableWeb3: () => { throw new Error('Not implemented') }
})

const log = console.log.bind(console, '[usePolkadot] ')
const logError = console.error.bind(console, '[usePolkadot] ')

const enableApi = async (endpoint: string, types: RegistryTypes) => {
    const { cryptoWaitReady } = await import('@polkadot/util-crypto')
    await cryptoWaitReady()
    log('Polkadot crypto ready')

    const { ApiPromise } = await import('@polkadot/api')
    const api = await ApiPromise.create({
        provider: new WsProvider(endpoint),
        types: types
    })
    log('Polkadot API ready')
    return api
}

const enableWeb3 = async (originName: string) => {
    /*  
        polkadot web3 is dynamically imported here, instead of importing globally
        in order to prevent "window is not defined" during server side rendering
        due to hardcoded reference to `window` in @polkadot/extension-dapp 
    */
    const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp')

    const extensions = await web3Enable(originName)
    log(`Injected extensions: ${extensions.map(ext => `${ext.name} (${ext.version})`).join(', ')}`)

    const accounts = await web3Accounts()
    log(`Injected accounts: ${accounts.map(account => `${account.address} (${account.meta.source})`).join(', ')}`)

    return accounts
}

export const PolkadotProvider: React.FC<{
    endpoint: string
    originName: string
    registryTypes: RegistryTypes
}> = ({ children, endpoint, originName, registryTypes }) => {
    const [account, setAccount] = useState<string | undefined>(undefined)
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>(undefined)
    const [api, setApi] = useState<ApiPromise | undefined>(undefined)
    const [readystate, setReadystate] = useState<PolkadotReadystate>('start')

    const enableApiPromise = useRef<Promise<ApiPromise>>()
    const enableWeb3Promise = useRef<Promise<InjectedAccountWithMeta[]>>()

    const value: IPolkadotContext = {
        account, accounts, api, readystate,

        enableApi: () => {
            if (api !== undefined) {
                return Promise.resolve(api)
            }

            if (enableApiPromise.current !== undefined) {
                return enableApiPromise.current
            }

            return enableApiPromise.current = enableApi(endpoint, registryTypes).then(api => {
                setApi(api)
                return api
            }).catch(error => {
                logError(`Failed to enable API: ${(error as Error)?.message ?? error}`)
                throw error
            })
        },

        enableWeb3: () => {
            switch (readystate) {
                case 'init':
                    if (enableWeb3Promise.current === undefined) {
                        return Promise.reject(new Error('Assertion failed'))
                    }
                    return enableWeb3Promise.current

                case 'ready':
                    if (accounts === undefined) {
                        return Promise.reject(new Error('Assertion failed'))
                    }
                    return Promise.resolve(accounts)

                case 'start':
                    setReadystate('init')
                    return enableWeb3Promise.current = enableWeb3(originName).then(accounts => {
                        setAccount(accounts[0]?.address)
                        setAccounts(accounts)
                        setReadystate('ready')
                        return accounts
                    }, error => {
                        logError(`Failed to enable web3: ${(error as Error)?.message ?? error}`)
                        setReadystate('unavailable')
                        throw error
                    }).finally(() => {
                        enableWeb3Promise.current = undefined
                    })

                case 'unavailable':
                    return Promise.reject(new Error('Polkadot extension is not available'))

                default:
                    return Promise.reject(new Error(`Unexpected readystate ${readystate}`))
            }
        },

        setAccount: (account: string) => {
            // TODO: check account existence against `accounts`
            setAccount(account)
        }
    }

    return (
        <PolkadotContext.Provider value={value}>
            {children}
        </PolkadotContext.Provider>
    )
}

export const usePolkadot = () => {
    const ctx = useContext(PolkadotContext)
    return ctx
}
