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
import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'
import { useQuery } from 'react-query'
import { WorkerDetails } from '../../libs/apis'
import { getWorkerByStash } from '../../libs/apis/getWorkerByStash'

interface WorkerInformationProps {
    worker: WorkerDetails
}

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

const WorkerByStashPage: React.FC = () => {
    const router = useRouter()
    const { stash } = router.query

    const { data } = useQuery(['api', 'getWorkerByStash', stash], async () => (
        await getWorkerByStash()
    ))

    return (
        <Space direction="vertical" size="large">
            <WorkerInformation worker={data} />
        </Space>
    )
}

export default WorkerByStashPage
