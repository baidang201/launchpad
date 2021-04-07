import { usePolkadot } from "../../libs/polkadot/context"

export const PolkadotStatus: React.FC = () => {
    const { accounts, readystate } = usePolkadot()

    return (
        <div>
            <div>Readystate: {readystate}</div>
            {accounts?.map(account => <div key={account.address}>Account: {account.address} ({account.meta.source})</div>)}
        </div>
    )
}
