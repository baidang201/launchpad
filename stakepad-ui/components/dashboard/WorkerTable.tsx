import { StyledLink } from 'baseui/link'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import React, { ReactElement } from 'react'
import { Worker } from '../../libs/apis'

export const MinerTable = ({ isLoading, miners }: {
    isLoading?: boolean
    miners: Worker[]
    // onSelectionChange: (miners: string[]) => void
}): ReactElement => {
    // const [selected, setSelected] = useState<Set<string>>(new Set())

    // const handleToggle = (stash: string, checked: boolean): void => {
    //     if (checked) {
    //         setSelected(new Set([...selected, stash]))
    //     } else {
    //         setSelected(new Set([...selected].filter(sel => sel !== stash)))
    //     }
    // }

    // const handleToggleAll = useCallback((checked: boolean): void => {
    //     const filter = new Set(miners.map(miner => miner.stash))
    //     if (checked) {
    //         setSelected(new Set([...selected, ...filter]))
    //     } else {
    //         setSelected(new Set([...selected].filter(sel => !filter.has(sel))))
    //     }
    // }, [miners, selected])

    // const hasCount = useMemo(() => {
    //     return miners
    //         .map(miner => selected.has(miner.stash))
    //         .reduce((count, flag) => flag ? count + 1 : count, 0)
    // }, [miners, selected])

    // const ToggleAllCheckbox = useMemo(() => (
    //     <Checkbox
    //         checked={hasCount === miners.length && hasCount > 0}
    //         isIndeterminate={hasCount > 0 && hasCount < miners.length}
    //         onChange={e => handleToggleAll(e.currentTarget.checked)}
    //     />
    // ), [handleToggleAll, hasCount, miners.length])

    return (
        <>
            <TableBuilder
                data={miners}
                emptyMessage="没有数据"
                isLoading={isLoading}
                loadingMessage="读取中"
            >
                {/* <TableBuilderColumn header={ToggleAllCheckbox}>
                    {(miner: Worker) => <Checkbox checked={selected.has(miner.stash)} onChange={e => handleToggle(miner.stash, e.currentTarget.checked)} />}
                </TableBuilderColumn> */}
                <TableBuilderColumn header="账户">
                    {(worker: Worker) => <StyledLink href={`workers/${worker.stash}`}>{worker.stash}</StyledLink>}
                </TableBuilderColumn>
                <TableBuilderColumn header="月收益">{(worker: Worker) => worker.monthlyPayout}</TableBuilderColumn>
                <TableBuilderColumn header="年化收益率">{(worker: Worker) => worker.annualizedReturnRate}</TableBuilderColumn>
                <TableBuilderColumn header="抵押额">{(worker: Worker) => worker.totalStake}</TableBuilderColumn>
                <TableBuilderColumn header="分润率">{(worker: Worker) => worker.commissionRate}</TableBuilderColumn>
                <TableBuilderColumn header="任务分">{(worker: Worker) => worker.taskScore}</TableBuilderColumn>
                <TableBuilderColumn header="机器分">{(worker: Worker) => worker.minerScore}</TableBuilderColumn>
                <TableBuilderColumn>
                    {(worker: Worker) => <StyledLink href={`workers/${worker.stash}`}>详情</StyledLink>}
                </TableBuilderColumn>
            </TableBuilder>
        </>
    )
}
