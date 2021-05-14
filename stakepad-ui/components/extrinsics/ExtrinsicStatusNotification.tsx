import { Alert as AlertIcon, Check as CheckIcon } from 'baseui/icon'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { SIZE as SpinnerSize, StyledSpinnerNext } from 'baseui/spinner'
import { ReactElement } from 'react'
import { ExtrinsicStatus } from '../../libs/polkadot/extrinsics'

const LoadingSpinner = (): ReactElement => <StyledSpinnerNext $as="span" size={SpinnerSize.small} />

export const ExtrinsicStatusNotification = ({ status }: { status?: ExtrinsicStatus }): ReactElement => {
    switch (status) {
        case undefined:
            return <></>
        case 'localSign':
            return <Notification kind={NotificationKind.warning}><LoadingSpinner /> 等待浏览器扩展签名</Notification>
        case 'broadcast':
            return <Notification kind={NotificationKind.info}><LoadingSpinner /> 交易发送中</Notification>
        case 'inBlock':
            return <Notification kind={NotificationKind.info}><LoadingSpinner /> 交易正在进入区块</Notification>
        case 'finalized':
            return <Notification kind={NotificationKind.positive}><CheckIcon /> 交易结束</Notification>
        default:
            return <Notification kind={NotificationKind.negative}><AlertIcon /> 交易失败或异常</Notification>
    }
}
