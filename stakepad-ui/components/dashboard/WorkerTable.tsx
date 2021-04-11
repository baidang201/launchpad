import { CopyOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import Table, { TablePaginationConfig } from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
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
            dataSource={keyedWorkers}
            loading={!isFetched}
            onChange={handleTableChange}
            pagination={{ current: currentPage, pageSize: pageSize, total: data?.total ?? 0 }}
            rowKey={(row: { index: string }) => row.index}
            rowSelection={{ type: 'checkbox' }}
            size="middle"
        >
            <Column title="" key="fav" render={() => (
                <Button icon={<StarOutlined />} size="small" type="text" />
            )} />
            <Column dataIndex="stash" key="stash" title="账户" render={(value) => (
                <span>
                    <Typography.Text>{value}</Typography.Text>
                    <Button icon={<CopyOutlined />} size="small" type="text" />
                </span>
            )} />
            <Column dataIndex="monthlyPayout" key="monthlyPayout" title="月收益" />
            <Column dataIndex="annualizedReturnRate" key="annualizedReturnRate" title="年化收益率" />
            <Column dataIndex="totalStake" key="totalStake" title="抵押额" />
            <Column dataIndex="commissionRate" key="commissionRate" title="分润率" />
            <Column dataIndex="taskScore" key="taskScore" title="任务分" />
            <Column dataIndex="minerScore" key="minerScore" title="机器分" />
            <Column title="" key="action" render={() => (
                <Button size="small" type="dashed" >详情</Button>
            )} />
        </Table>
    )
}
