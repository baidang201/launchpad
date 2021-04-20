import { Button, KIND as BUTTON_KIND, SIZE as BUTTON_SIZE } from 'baseui/button'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Worker } from '../../libs/apis'
import { findWorkersByStash } from '../../libs/apis/workers'

const defaultPageSize = 10

interface FindWorkerFilters {
    commissionRateLessThan20: boolean
    mining: boolean
    stakePending: boolean
}

interface WorkerTableProps {
    filters: FindWorkerFilters
    stash?: string
}

export const WorkerTable: React.FC<WorkerTableProps> = ({ filters, stash }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(defaultPageSize)

    const { data, isFetched } = useQuery([
        'api', 'findWorkersByStash', filters, currentPage, pageSize, stash
    ], async () => {
        return await findWorkersByStash(filters, currentPage, pageSize, stash)
    })

    const router = useRouter()

    const handleDetailClick = (stash: string): void => {
        router.push(`/workers/${stash}`).catch(error => {
            console.error(`WorkerTable: Failed to navigate to /workers/${stash}: ${(error as Error)?.message ?? error}`)
        })
    }

    return (
        <>
            <TableBuilder
                data={data?.workers?.length > 0 ? data.workers : undefined}
                emptyMessage="没有数据"
                isLoading={!isFetched}
                loadingMessage="读取中"
            >
                <TableBuilderColumn header="账户">{(worker: Worker) => worker.stash}</TableBuilderColumn>
                <TableBuilderColumn header="月收益">{(worker: Worker) => worker.monthlyPayout}</TableBuilderColumn>
                <TableBuilderColumn header="年化收益率">{(worker: Worker) => worker.annualizedReturnRate}</TableBuilderColumn>
                <TableBuilderColumn header="抵押额">{(worker: Worker) => worker.totalStake}</TableBuilderColumn>
                <TableBuilderColumn header="分润率">{(worker: Worker) => worker.commissionRate}</TableBuilderColumn>
                <TableBuilderColumn header="任务分">{(worker: Worker) => worker.taskScore}</TableBuilderColumn>
                <TableBuilderColumn header="机器分">{(worker: Worker) => worker.minerScore}</TableBuilderColumn>
                <TableBuilderColumn>
                    {(worker: Worker) =>
                        <Button
                            onClick={() => handleDetailClick(worker.stash)}
                            kind={BUTTON_KIND.minimal}
                            size={BUTTON_SIZE.mini}
                        >
                            详情
                        </Button>
                    }
                </TableBuilderColumn>
            </TableBuilder >
        </>
    )
}
