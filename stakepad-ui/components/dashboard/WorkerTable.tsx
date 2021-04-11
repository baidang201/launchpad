import Table, { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Worker } from '../../libs/apis'
import { findWorkersByStash } from '../../libs/apis/findWorkersByStash'

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

type LocalColumnsType = Array<{ dataIndex: keyof Worker }> & ColumnsType

const columns: LocalColumnsType = [
    {
        title: '账户',
        dataIndex: 'stash'
    }, {
        title: '月收益',
        dataIndex: 'monthlyPayout'
    }, {
        title: '年化',
        dataIndex: 'annualizedReturnRate'
    }, {
        title: '抵押额',
        dataIndex: 'totalStake'
    }, {
        title: '分润率',
        dataIndex: 'commissionRate'
    }, {
        title: '任务分',
        dataIndex: 'taskScore'
    }, {
        title: '机器分',
        dataIndex: 'minerScore'
    }
]

// eslint-disable-next-line react/prop-types
export const WorkerTable: React.FC<WorkerTableProps> = ({ filters, stash }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(defaultPageSize)

    const { data, isFetched } = useQuery([
        'api', 'findWorkersByStash', filters, currentPage, pageSize, stash
    ], async () => {
        return await findWorkersByStash(filters, currentPage, pageSize, stash)
    })

    const keyedWorkers = useMemo(() => data?.workers?.map((worker, index) => ({
        ...worker,
        index: `${currentPage}-${index}`
        // TODO: use controller address as index for further selection implementation
    })), [data, currentPage])

    const handleTableChange = (pagination: TablePaginationConfig): void => {
        if (pagination.current !== currentPage) {
            setCurrentPage(pagination.current ?? 1)
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize ?? defaultPageSize)
        }
    }

    return (
        <Table
            columns={columns}
            dataSource={keyedWorkers}
            loading={!isFetched}
            onChange={handleTableChange}
            pagination={{ current: currentPage, pageSize: pageSize, total: data?.total ?? 0 }}
            rowKey={(row: { index: string }) => row.index}
            rowSelection={{ type: 'checkbox' }}
        />
    )
}
