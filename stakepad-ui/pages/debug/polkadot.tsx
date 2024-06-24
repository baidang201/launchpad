import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { ReactElement } from 'react'
import { useApiPromise, useWeb3 } from '../../libs/polkadot'

const PolkadotStatus = (): ReactElement => {
    const { api, readystate: apiReadystate } = useApiPromise()
    const { accounts, readystate: web3Readystate } = useWeb3()

    return (
        <div>
            <div>
                WebSocket API Readystate: {apiReadystate} <br />
                Runtime version: {api?.runtimeVersion.toString()} <br />
                Extrinsic version: {api?.extrinsicVersion.toString()}
            </div>

            <div>Web3 Readystate: {web3Readystate}</div>

            <TableBuilder data={accounts} isLoading={web3Readystate !== 'ready'} loadingMessage="Waiting for Web3">
                <TableBuilderColumn header="Address">{(account: typeof accounts[number]) => account.address}</TableBuilderColumn>
                <TableBuilderColumn header="Source">{(account: typeof accounts[number]) => account.meta.source}</TableBuilderColumn>
            </TableBuilder>
        </div>
    )
}

export default PolkadotStatus
