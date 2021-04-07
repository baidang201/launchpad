import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import React, { useContext, useEffect, useState } from 'react'

type PolkadotReadystate = 'start' | 'init' | 'ready' | 'unavailable'

interface IPolkadotContext {
    accounts: InjectedAccountWithMeta[] | undefined
    readystate: PolkadotReadystate
}

const PolkadotContext = React.createContext<IPolkadotContext>({
    accounts: undefined,
    readystate: 'start'
})

export const PolkadotProvider: React.FC = ({ children }) => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | undefined>(undefined)
    const [readystate, setReadystate] = useState<PolkadotReadystate>('start')

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        // dynamically imported to prevent "window is not defined" during server side rendering
        // due to hardcoded reference to window in @polkadot/extension-dapp
        import('@polkadot/extension-dapp').then(({ web3Accounts, web3Enable }) => {
            if (readystate === 'start') {
                setReadystate('init')
                web3Enable('Phala Stakepad').then(extensions => {
                    setReadystate(extensions.length === 0 ? 'unavailable' : 'ready')
                    console.log(`[PolkadotCtx] Injected extensions: ${extensions.map(ext => `${ext.name} (${ext.version})`).join(', ')}`)

                    web3Accounts().then(accounts => {
                        setAccounts(accounts)
                        accounts.forEach((account, index) => {
                            console.log(`[PolkadotCtx] Injected account (${index + 1}/${accounts.length}): ${account.address} (${account.meta.source})`)
                        })
                    }).catch(error => {
                        console.error('[PolkadotCtx] Failed to get accounts: ', (error as Error).message ?? error)
                    })
                }).catch(error => {
                    setReadystate('unavailable')
                    console.error('[PolkadotCtx] Failed to enable: ', (error as Error).message ?? error)
                })
            }
        })
    })

    return (
        <PolkadotContext.Provider value={{ accounts, readystate }}>
            {children}
        </PolkadotContext.Provider>
    )
}

export const usePolkadot = () => {
    const ctx = useContext(PolkadotContext)
    return ctx
}
