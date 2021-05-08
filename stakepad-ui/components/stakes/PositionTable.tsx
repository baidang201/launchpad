import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import React, { ReactElement, useState } from 'react'
import { useApiPromise } from '../../libs/polkadot'
import { useStakePendingQuery } from '../../libs/queries/usePendingStakeQuery'
import { useStakePositionQuery } from '../../libs/queries/useStakeQuery'
import { PositionInput } from './PositionInput'
import BN from 'bn.js'
import { AccountId } from '@polkadot/types/interfaces'
import { decodeAddress } from '@polkadot/util-crypto'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'
import { StyledSpinnerNext } from 'baseui/spinner'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $as="span" />

const CommissionRateColumn = ({ address }: { address: string }): ReactElement => {
    const { data, isLoading } = useStashInfoQuery(decodeAddress(address) as AccountId)
    return (
        isLoading
            ? <LoadingSpinner />
            : data === undefined
                ? <>n/a</>
                : <>{data.payoutPrefs.commission}</>
    )
}

const BNZero = new BN(0)

const PositionPendingColumn = ({ miner, staker }: { miner: string, staker: string }): ReactElement => {
    const { api } = useApiPromise()
    const data = useStakePendingQuery(staker, miner, api)

    if (data !== undefined) {
        const { staking, unstaking } = data
        const pending = api?.registry.createType('Balance', (staking ?? BNZero).add(unstaking ?? BNZero))
        if (pending !== undefined) {
            return (<>{pending.gt(BNZero) ? `+${pending.toHuman()}` : pending.toHuman()}</>)
        }
    }

    return <>n/a</>
}

const PositionInputColumn = ({ miner, onChange, staker }: {
    miner: string
    staker: string
    onChange: (newPosition?: number) => void
}): ReactElement => {
    const { api } = useApiPromise()
    const balance = useStakePositionQuery(staker, miner, api)

    return (<PositionInput currentPosition={balance} onChange={onChange} />)
}

export const PositionTable = ({ miners, staker }: { miners?: string[], staker: string }): ReactElement => {
    const [targetPositions, setTargetPositions] = useState<Record<string, number | undefined>>({})

    const handlePositionChange = (miner: string, newPosition?: number): void => {
        const newTargetPositions = { ...targetPositions }
        newTargetPositions[miner] = newPosition
        setTargetPositions(newTargetPositions)
    }

    return (
        <TableBuilder
            data={miners ?? []}
            emptyMessage="No Data"
            isLoading={miners === undefined}
            loadingMessage="Loading"
        >
            <TableBuilderColumn header="Miner">
                {miner => <>{miner}</>}
            </TableBuilderColumn>

            <TableBuilderColumn header="Commission">
                {(miner: string) => <CommissionRateColumn address={miner} />}
            </TableBuilderColumn>

            <TableBuilderColumn header="Pending Position">
                {(miner: string) => <PositionPendingColumn miner={miner} staker={staker} />}
            </TableBuilderColumn>

            <TableBuilderColumn header="New Position">
                {(miner: string) => (
                    <PositionInputColumn
                        miner={miner}
                        onChange={newPosition => handlePositionChange(miner, newPosition)}
                        staker={staker}
                    />
                )}
            </TableBuilderColumn>
        </TableBuilder>
    )
}
