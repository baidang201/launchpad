import { AccountId, BalanceOf } from '@polkadot/types/interfaces'
import { decodeAddress } from '@polkadot/util-crypto'
import { Button } from 'baseui/button'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import BN from 'bn.js'
import React, { ReactElement, useMemo, useState, useRef } from 'react'
import { useApiPromise } from '../../libs/polkadot'
import { useStakePendingQuery } from '../../libs/queries/usePendingStakeQuery'
import { useStakePositionQuery, useStakerPositionsQuery } from '../../libs/queries/useStakeQuery'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'
import { PositionInput } from './PositionInput'

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

const PositionInputColumn = ({ miner, onChange, staker, zeroizeEvent }: {
    miner: string
    staker: string
    onChange: (newPosition?: number) => void
    zeroizeEvent: EventTarget
}): ReactElement => {
    const { api } = useApiPromise()
    const balance = useStakePositionQuery(staker, miner, api)

    return (<PositionInput currentPosition={balance} onChange={onChange} zeroizeEvent={zeroizeEvent} />)
}

export const PositionTable = ({ miners, staker }: { miners?: string[], staker: string }): ReactElement => {
    const [targetPositions, setTargetPositions] = useState<Record<string, number | undefined>>({})

    const { api } = useApiPromise()
    const { data: currentPositions } = useStakerPositionsQuery(staker, api)

    const handlePositionChange = (miner: string, newPosition?: number): void => {
        const newTargetPositions = { ...targetPositions }
        newTargetPositions[miner] = newPosition
        setTargetPositions(newTargetPositions)
    }

    const zeroizeEvent = useRef(new EventTarget())

    const positionInputHeader = useMemo(() => {
        return (<Button onClick={() => zeroizeEvent.current.dispatchEvent(new Event('zeroize'))} size="mini">Zeroize All</Button>)
    }, [])

    const minerSet = useMemo(() => new Set(miners), [miners])
    const closingBalance = useMemo(() => {
        const balance = Object
            .entries(currentPositions ?? {})
            .filter(([miner]) => minerSet.has(miner))
            .map(([miner, balance]) => {
                const target = targetPositions[miner]
                return target === undefined ? balance : new BN(target)
            })
            .reduce((accumulator, current) => accumulator.add(current), BNZero)
        return api?.registry.createType('BalanceOf', balance) as BalanceOf ?? balance
    }, [api, currentPositions, minerSet, targetPositions])

    return (
        <>
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

                <TableBuilderColumn header="Pending">
                    {(miner: string) => <PositionPendingColumn miner={miner} staker={staker} />}
                </TableBuilderColumn>

                <TableBuilderColumn header={positionInputHeader}>
                    {(miner: string) => (
                        <PositionInputColumn
                            miner={miner}
                            onChange={newPosition => handlePositionChange(miner, newPosition)}
                            staker={staker}
                            zeroizeEvent={zeroizeEvent.current}
                        />
                    )}
                </TableBuilderColumn>
            </TableBuilder>
            <FlexGrid>
                <FlexGridItem>
                    Closing Balance: {closingBalance.toHuman?.() ?? closingBalance.toString()}
                </FlexGridItem>
            </FlexGrid>
        </>
    )
}
