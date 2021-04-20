import { Button } from 'baseui/button'
import { Alert as AlertIcon, Check as CheckIcon, Delete as DeleteIcon } from 'baseui/icon'
import { Spinner } from 'baseui/spinner'
import { StatefulTooltip } from 'baseui/tooltip'
import { DisplayMedium as Display, LabelMedium as Label } from 'baseui/typography'
import React, { PropsWithChildren } from 'react'
import { WorkerDetails } from '../../libs/apis'
import styles from './information.module.css'

interface WorkerInformationProps {
    worker?: WorkerDetails
}

type WorkerInformationItemProps = PropsWithChildren<{ label: string }>

const WorkerInformationItem: React.FC<WorkerInformationItemProps> = ({
    children, label
}: WorkerInformationItemProps) => {
    return (
        <>
            <span className={styles.itemLabel}>{label}</span>
            <span className={styles.itemValue}>{children}</span>
        </>
    )
}

export const WorkerInformation: React.FC<WorkerInformationProps | undefined> = ({ worker }: WorkerInformationProps) => {
    const onlineStatus = (worker?.online ?? false)
        ? <><CheckIcon /> 在线</>
        : <><AlertIcon /> 离线</>

    const favouriteStatus = (worker?.favourited ?? false)
        ? <StatefulTooltip content="已收藏"><Button kind="minimal" startEnhancer={<CheckIcon />}></Button></StatefulTooltip>
        : <StatefulTooltip content="收藏"><Button kind="minimal" startEnhancer={<DeleteIcon />}></Button></StatefulTooltip>

    return (
        <WorkerInformationItem label="Stash">{worker?.stash ?? <Spinner />}</WorkerInformationItem>
        // <Card>
        //     <Row align="middle" gutter={32}>
        //         <Col flex={1}>
        //         </Col>
        //         <Col flex={1}>
        //             <WorkerInformationItem label="Controller">{worker?.controller ?? <LoadingOutlined />}</WorkerInformationItem>
        //         </Col>
        //     </Row>

        //     <Divider type="horizontal" />

        //     <Row align="middle" gutter={32} justify="space-between">
        //         <Col flex="none">
        //             <Space size={32}>
        //                 <WorkerInformationItem label="机器分">{worker?.minerScore ?? <LoadingOutlined />}</WorkerInformationItem>
        //                 <WorkerInformationItem label="任务分">{worker?.taskScore ?? <LoadingOutlined />}</WorkerInformationItem>
        //                 <WorkerInformationItem label="状态">{onlineStatus ?? <LoadingOutlined />}</WorkerInformationItem>
        //             </Space>
        //         </Col>
        //         <Col flex="none">
        //             {favouriteStatus}
        //             <Button size="large">抵押</Button>
        //         </Col>
        //     </Row>
        // </Card>
    )
}
