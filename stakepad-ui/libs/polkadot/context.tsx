import { ApiPromise } from '@polkadot/api'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import React, { useContext, useRef, useState } from 'react'

const AppName = 'Phala Stakepad'

type PolkadotReadystate = 'start' | 'init' | 'ready' | 'unavailable'

interface IPolkadotContext {
    accounts: InjectedAccountWithMeta[] | undefined
    api: ApiPromise | undefined
    readystate: PolkadotReadystate

    enableApi: () => void
    enableWeb3: () => void
}

const PolkadotContext = React.createContext<IPolkadotContext>({
    accounts: undefined,
    api: undefined,
    readystate: 'start',

    enableApi: () => { throw new Error('Not implemented') },
    enableWeb3: () => { throw new Error('Not implemented') }
})


const enableWeb3 = async (originName: string) => {
    /*  
        polkadot web3 is dynamically imported here, instead of importing globally
        in order to prevent "window is not defined" during server side rendering
        due to hardcoded reference to window in @polkadot/extension-dapp 
    */
    const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp')

    const extensions = await web3Enable(originName)
    log.info(`Injected extensions: ${extensions.map(ext => `${ext.name} (${ext.version})`).join(', ')}`)

    const accounts = await web3Accounts()
    log.info(`Injected accounts: ${accounts.map(account => `${account.address} (${account.meta.source})`).join(', ')}`)

    return accounts
}

const log = console

export const PolkadotProvider: React.FC<{
    endpoint: string
}> = ({ children, endpoint }) => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>(undefined)
    // const [api, setApi] = useState<ApiPromise | undefined>(undefined)
    const [readystate, setReadystate] = useState<PolkadotReadystate>('start')

    // const enableApiPromise = useRef<Promise<void>>()
    const enableWeb3Promise = useRef<Promise<void>>()

    const value = {
        accounts, api: undefined, readystate,

        enableApi: () => { throw new Error('Not implemented') },

        enableWeb3: () => {
            if (readystate !== 'start') {
            return
        }

            if (enableWeb3Promise.current !== undefined) {
                return enableWeb3Promise.current
            }

                setReadystate('init')
            return enableWeb3Promise.current = enableWeb3(AppName).then(accounts => {
                        setAccounts(accounts)
                setReadystate('ready')
            }, error => {
                log.error(`Failed to enable web3: ${(error as Error)?.message ?? error}`)
                    setReadystate('unavailable')
                throw error
            }).finally(() => {
                enableWeb3Promise.current = undefined
                })
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
