import { ApiPromise } from '@polkadot/api'
import { AccountId, Balance } from '@polkadot/types/interfaces'
import { decodeAddress } from '@polkadot/util-crypto'
import { Button } from 'baseui/button'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { StyledSpinnerNext } from 'baseui/spinner'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import BN from 'bn.js'
import { Decimal } from 'decimal.js'
import React, { ReactElement, useMemo, useState } from 'react'
import { stakeBatch } from '../../libs/extrinsics/stake'
import { useApiPromise } from '../../libs/polkadot'
import { ExtrinsicStatus } from '../../libs/polkadot/extrinsics'
import { useStakePendingQuery } from '../../libs/queries/usePendingStakeQuery'
import { useStakerPositionsQuery } from '../../libs/queries/useStakeQuery'
import { useStashInfoQuery } from '../../libs/queries/useStashInfoQuery'
import { useDecimalJsTokenDecimalMultiplier } from '../../libs/queries/useTokenDecimals'
import { bnToBalance, decimalToBN } from '../../libs/utils/balances'
import { ExtrinsicStatusNotification } from '../extrinsics/ExtrinsicStatusNotification'
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

const BNZero = new BN(0)
const DecimalZero = new Decimal(0)

const ClosingBalance = ({ api, currentPositions, miners, targetPositions }: {
    api?: ApiPromise
    currentPositions?: Record<string, Balance>
    miners?: string[]
    targetPositions: Record<string, Decimal | undefined>
}): ReactElement => {
    const targetPositionMap = useMemo(() => new Map(Object.entries(targetPositions)), [targetPositions])
    const tokenDecimals = useDecimalJsTokenDecimalMultiplier()

    const closingBalance = useMemo<Balance | undefined>(() => {
        if (api === undefined || miners === undefined || tokenDecimals === undefined) { return undefined }

        const closing = miners
            .map(miner => {
                const current = currentPositions?.[miner] ?? BNZero
                const target = targetPositionMap.get(miner)
                if (target !== undefined) {
                    return new BN(target.mul(tokenDecimals).toString())
                } else {
                    return current
                }
            }).reduce((acc, balance) => acc.add(balance), BNZero)

        return api.registry.createType('Balance', closing)
    }, [api, currentPositions, miners, targetPositionMap, tokenDecimals])

    const openingBalance = useMemo<Balance | undefined>(() => {
        if (api === undefined || currentPositions === undefined || miners === undefined || tokenDecimals === undefined) { return undefined }

        const opening = miners
            .map(miner => currentPositions?.[miner] ?? BNZero)
            .reduce((acc, balance) => acc.add(balance), BNZero)

        return api.registry.createType('Balance', opening)
    }, [api, currentPositions, miners, tokenDecimals])

    const floatingResult = useMemo<[boolean, Balance] | undefined>(() => {
        if (api === undefined || closingBalance === undefined || openingBalance === undefined) { return undefined }

        const result = closingBalance.sub(openingBalance)
        if (result.eq(BNZero)) {
            return undefined
        } else {
            return [result.lt(BNZero), api.registry.createType('Balance', result.abs())]
        }
    }, [api, closingBalance, openingBalance])

    return (<>
        {closingBalance?.toHuman() ?? <LoadingSpinner />}
        {floatingResult !== undefined && <>({floatingResult[0] ? '-' : '+'}{floatingResult[1].toHuman()})</>}
    </>)
}

export const PositionTable = ({ miners, staker }: { miners?: string[], staker: string }): ReactElement => {
    const { api } = useApiPromise()
    const { data: currentPositions, refetch } = useStakerPositionsQuery(staker, api)
    const tokenDecimals = useDecimalJsTokenDecimalMultiplier()

    const [targetPositions, setTargetPositions] = useState<Record<string, Decimal | undefined>>({})

    const handlePositionChange = (miner: string, newPosition?: Decimal): void => {
        const newTargetPositions = { ...targetPositions }
        newTargetPositions[miner] = newPosition
        setTargetPositions(newTargetPositions)
    }

    const [extrinsicError, setExtrinsicError] = useState<string>()
    const [extrinsicStatus, setExtrinsicStatus] = useState<ExtrinsicStatus>()

    const handleSubmit = (): void => {
        if (api === undefined || tokenDecimals === undefined) { return }

        setExtrinsicStatus(undefined)

        const adjustments = Object.fromEntries(Object.entries(targetPositions)
            .filter((tuple): tuple is [string, Decimal] => {
                return typeof tuple[0] === 'string' && tuple[1] instanceof Decimal
            }).map(([miner, decimalTarget]): [string, ['stake' | 'unstake', Balance]] => {
                const current = currentPositions?.[miner] ?? BNZero
                const target = decimalToBN(decimalTarget, tokenDecimals)
                const offset = target.sub(current)
                return [miner, [offset.gt(BNZero) ? 'stake' : 'unstake', bnToBalance(offset.abs(), api)]]
            }))

        stakeBatch({
            api, batch: adjustments, staker, statusCallback: (status) => setExtrinsicStatus(status)
        }).then(() => {
            refetch().catch(() => { })
        }).catch(error => {
            setExtrinsicError((error as Error)?.message ?? error)
        })
    }

    const positionInputHeader = useMemo(() => {
        const zeroize = (): void => {
            setTargetPositions(Object.fromEntries(miners?.map(miner => [miner, DecimalZero]) ?? []))
        }

        return (<Button onClick={() => zeroize()} size="mini">Zeroize All</Button>)
    }, [miners])

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
                        <PositionInput
                            currentPosition={currentPositions?.[miner]}
                            disabled={false} // TODO: set to true during submitting
                            onChange={newPosition => handlePositionChange(miner, newPosition)}
                            targetPosition={targetPositions[miner]}
                        />
                    )}
                </TableBuilderColumn>
            </TableBuilder>
            <FlexGrid flexDirection="row">
                <FlexGridItem>
                    Closing Balance: <ClosingBalance api={api} currentPositions={currentPositions} miners={miners} targetPositions={targetPositions} />
                </FlexGridItem>
                <FlexGridItem alignSelf="flex-end">
                    <Button onClick={handleSubmit}>Submit</Button>
                    {typeof extrinsicError === 'string' && (
                        <Notification kind={NotificationKind.negative}>{extrinsicError}</Notification>
                    )}
                    <ExtrinsicStatusNotification status={extrinsicStatus} />
                </FlexGridItem>
            </FlexGrid>
        </>
    )
}
