import { ApiPromise } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export { PolkadotProvider, usePolkadot } from './context';

export const AppName = 'Phala Stakepad'

export type PolkadotReadystate = 'start' | 'init' | 'ready' | 'unavailable'

export interface IPolkadotContext {
    /**
     * Current selected (active) account
     */
    readonly account?: string

    /**
     * All available accounts injected by Polkadot extensions
     */
    readonly accounts?: InjectedAccountWithMeta[]

    /**
     * ApiPromise instance to make calls
     */
    readonly api?: ApiPromise

    /**
     * Readystate of Polkadot web3 extension
     * 
     * @see PolkadotReadystate
     */
    readonly readystate: PolkadotReadystate

    enableApi: () => Promise<ApiPromise>

    enableWeb3: () => Promise<InjectedAccountWithMeta[]>

    /**
     * Change the current account to
     */
    setAccount: (account: string) => void
}
