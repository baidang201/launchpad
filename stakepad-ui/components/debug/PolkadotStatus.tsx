import { usePolkadot } from "../../libs/polkadot/context"

export const PolkadotStatus: React.FC = () => {
    const { accounts, readystate, enableWeb3 } = usePolkadot()

    return (
        <div>
            <div>Readystate: {readystate}</div>
            {accounts?.map(account => <div key={account.address}>Account: {account.address} ({account.meta.source})</div>)}
            {readystate === 'start' && <button onClick={() => enableWeb3()}>Enable Web3</button>}
        </div>
    )
}
