import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import PauseCircleTwoTone from '@ant-design/icons/PauseCircleTwoTone'
import PlayCircleTwoTone from '@ant-design/icons/PlayCircleTwoTone'
import StarFilled from '@ant-design/icons/StarFilled'
import StarTwoTone from '@ant-design/icons/StarTwoTone'
import Button from 'antd/lib/button'
import Card from 'antd/lib/card'
import Col from 'antd/lib/col'
import Divider from 'antd/lib/divider'
import Row from 'antd/lib/row'
import Space from 'antd/lib/space'
import Tooltip from 'antd/lib/tooltip'
import Typography from 'antd/lib/typography'
import { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useRouter } from 'next/router'
import React, { PropsWithChildren, useMemo } from 'react'
import { useQuery } from 'react-query'
import { GlobalStakeHistoryPoint, WorkerDetails, WorkerStakeHistoryPoint } from '../../libs/apis'
import { getWorkerByStash } from '../../libs/apis/getWorkerByStash'

type WorkerInformationItemProps = PropsWithChildren<{ title: string }>

const WorkerInformationItem: React.FC<WorkerInformationItemProps> = ({
    children, title
}: WorkerInformationItemProps) => {
    return (
        <Space direction="vertical">
            <Typography.Text type="secondary">{title}</Typography.Text>
            <Typography.Text style={{ fontSize: '1.25em' }}>{children}</Typography.Text>
        </Space>
    )
}

interface WorkerInformationProps {
    worker?: WorkerDetails
}

const WorkerInformation: React.FC<WorkerInformationProps | undefined> = ({ worker }: WorkerInformationProps) => {
    const onlineStatus = (worker?.online ?? false)
        ? <><PlayCircleTwoTone twoToneColor='#64EEAC' /> 在线</>
        : <><PauseCircleTwoTone /> 离线</>

    const favouriteStatus = (worker?.favourited ?? false)
        ? <Tooltip title="已收藏"><Button icon={<StarFilled style={{ color: '#F2C94C' }} />} type="text"></Button></Tooltip>
        : <Tooltip title="收藏"><Button icon={<StarTwoTone twoToneColor='#F2C94C' />} type="text"></Button></Tooltip>

    return (
        <Card>
            <Row align="middle" gutter={32}>
                <Col flex={1}>
                    <WorkerInformationItem title="Stash">{worker?.stash ?? <LoadingOutlined />}</WorkerInformationItem>
                </Col>
                <Col flex={1}>
                    <WorkerInformationItem title="Controller">{worker?.controller ?? <LoadingOutlined />}</WorkerInformationItem>
                </Col>
            </Row>

            <Divider type="horizontal" />

            <Row align="middle" gutter={32} justify="space-between">
                <Col flex="none">
                    <Space size={32}>
                        <WorkerInformationItem title="机器分">{worker?.minerScore ?? <LoadingOutlined />}</WorkerInformationItem>
                        <WorkerInformationItem title="任务分">{worker?.taskScore ?? <LoadingOutlined />}</WorkerInformationItem>
                        <WorkerInformationItem title="状态">{onlineStatus ?? <LoadingOutlined />}</WorkerInformationItem>
                    </Space>
                </Col>
                <Col flex="none">
                    {favouriteStatus}
                    <Button size="large">抵押</Button>
                </Col>
            </Row>
        </Card>
    )
}

function StakeChart({ worker: workerDetails }: { worker?: WorkerDetails }): JSX.Element {
    const { globalStakeHistory: global, workerStakeHistory: worker } = workerDetails ?? {
        globalStakeHistory: [] as GlobalStakeHistoryPoint[],
        workerStakeHistory: [] as WorkerStakeHistoryPoint[]
    }

    const options: EChartsOption = useMemo(() => ({
        backgroundColor: '#000000',

        dataset: [
            {
                source: global.map(point => [point.timestamp, point.stake, point.round]),
                id: 'global'
            }, {
                source: worker.map(point => [point.timestamp, point.totalStake, point.ownerStake]),
                id: 'worker'
            }
        ],

        series: [
            {
                color: '#64EEAC',
                datasetId: 'global',
                dimensions: ['时间戳', '全局平均总抵押量'],
                encode: {
                    x: [0],
                    y: [1],
                    tooltip: [1]
                },
                name: '全局平均总抵押量',
                smooth: 0.5,
                type: 'line'
            }, {
                color: '#EB5757',
                datasetId: 'worker',
                dimensions: ['时间戳', '矿机总抵押量'],
                encode: {
                    x: [0],
                    y: [1],
                    tooltip: [1]
                },
                name: '矿机总抵押量',
                smooth: 0.5,
                type: 'line'
            }, {
                color: '#D1FF52',
                datasetId: 'worker',
                dimensions: ['时间戳', '', '矿机自带抵押量'],
                encode: {
                    x: [0],
                    y: [2],
                    tooltip: [2]
                },
                name: '矿机自带抵押量',
                smooth: 0.5,
                type: 'line'
            }, {
                color: '#FFFFFF',
                datasetId: 'global',
                dimensions: ['时间戳', '', '轮数'],
                encode: {
                    x: [0],
                    y: [],
                    tooltip: [2]
                },
                name: '轮数',
                renderItem: () => ({ type: 'text' }),
                type: 'custom'
            }
        ],

        tooltip: {
            axisPointer: {
                snap: true,
                type: 'line'
            },
            textStyle: {
                fontSize: 12
            },
            trigger: 'axis'
        },

        xAxis: [{
            id: 'timestamp',
            name: '时间戳',
            position: 'bottom',
            type: 'time'
        }],

        yAxis: [{
            id: 'value',
            scale: true,
            splitLine: {
                lineStyle: {
                    opacity: 0.25
                }
            },
            type: 'value'
        }]
    }), [global, worker])

    return (
        <ReactECharts option={options} />
    )
}

const WorkerByStashPage: React.FC = () => {
    const router = useRouter()
    const { stash } = router.query

    const { data } = useQuery(['api', 'getWorkerByStash', stash], async () => (
        await getWorkerByStash()
    ))

    return (
        <Space direction="vertical" size="large">
            <WorkerInformation worker={data} />
            <StakeChart worker={data} />
        </Space>
    )
}

export default WorkerByStashPage
