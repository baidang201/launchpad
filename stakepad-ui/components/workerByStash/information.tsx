import { BlockProps } from 'baseui/block'
import { Button } from 'baseui/button'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { Alert as AlertIcon, Check as CheckIcon, Delete as DeleteIcon } from 'baseui/icon'
import { Spinner } from 'baseui/spinner'
import { StatefulTooltip } from 'baseui/tooltip'
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

const blockProps: BlockProps = {
    alignItems: 'center',
    height: 'scale1000',
    justifyContent: 'center',
    overrides: {
        Block: {
            style: () => ({ flexGrow: 0 })
        }
    }
}

export const WorkerInformation: React.FC<WorkerInformationProps | undefined> = ({ worker }: WorkerInformationProps) => {
    const onlineStatus =
        typeof worker?.online === 'boolean'
            ? (worker.online
                ? <><CheckIcon /> 在线</>
                : <><AlertIcon /> 离线</>)
            : <Spinner />

    const favouriteStatus =
        typeof worker?.favourited === 'boolean'
            ? (worker.favourited
                ? <StatefulTooltip content="已收藏"><Button startEnhancer={<CheckIcon />}></Button></StatefulTooltip>
                : <StatefulTooltip content="收藏"><Button startEnhancer={<DeleteIcon />}></Button></StatefulTooltip>)
            : <Spinner />

    return (
        <>
            <FlexGrid flexGridColumnGap="1000scale">
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="Stash">{worker?.stash ?? <Spinner />}</WorkerInformationItem>
                </FlexGridItem>
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="Controller">{worker?.controller ?? <Spinner />}</WorkerInformationItem>
                </FlexGridItem>
            </FlexGrid>

            <FlexGrid flexGridColumnGap="1000scale">
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="机器分">{worker?.minerScore ?? <Spinner />}</WorkerInformationItem>
                </FlexGridItem>
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="任务分">{worker?.taskScore ?? <Spinner />}</WorkerInformationItem>
                </FlexGridItem>
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="状态">{onlineStatus}</WorkerInformationItem>
                </FlexGridItem>
                <FlexGridItem {...blockProps}>
                    <WorkerInformationItem label="收藏">{favouriteStatus}</WorkerInformationItem>
                </FlexGridItem>
                <FlexGridItem {...blockProps}>
                    <Button onClick={() => alert('click')}>抵押</Button>
                </FlexGridItem>
            </FlexGrid>
        </>
    )
}
