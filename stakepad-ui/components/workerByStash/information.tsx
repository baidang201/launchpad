import { LoadingOutlined, PauseCircleTwoTone, PlayCircleTwoTone, StarFilled, StarTwoTone } from '@ant-design/icons'
import { Button, Card, Col, Divider, Row, Space, Tooltip, Typography } from 'antd'
import React, { PropsWithChildren } from 'react'
import { WorkerDetails } from '../../libs/apis'

interface WorkerInformationProps {
    worker?: WorkerDetails
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

export const WorkerInformation: React.FC<WorkerInformationProps | undefined> = ({ worker }: WorkerInformationProps) => {
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
