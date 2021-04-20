import React, { ReactElement } from 'react'
import { useQuery } from 'react-query'
import { getGlobalTelemetry } from '../../libs/apis/globalTelemetry'
import { LabelMedium as Label, DisplayMedium as Display } from 'baseui/typography'
import styles from './GlobalTelemetry.module.css'

const TelemetryItem = ({ label, value }: {
    label: string
    value: any
}): ReactElement => {
    return (
        <>
            <span className={styles.statLabel}>
                <Label>{label}</Label>
            </span>
            <span className={styles.statData}>
                <Label>{value}</Label>
            </span>
        </>
    )
}

export const GlobalTelemetry: React.FC = () => {
    const { data, isFetched } = useQuery(['api', 'getGlobalTelemetry'], async () => await getGlobalTelemetry())

    const isLoading = !isFetched

    return (
        <>
            <div className={styles.flexContainer}>
                <div className={styles.flexItem}>
                    <TelemetryItem label="抵押年化" value={data?.annualizedReturnRate} />
                </div>
            </div>
            {/* <Row>
                <Col span={3}>
                    <Statistic loading={isLoading} title="抵押年化" value={data?.annualizedReturnRate} />
                </Col>
                <Col span={3}>
                    <Statistic loading={isLoading} title="上一轮奖励额" value={data?.lastRoundReturn} />
                </Col>
                <Col span={6}>
                    <Statistic
                        loading={isLoading}
                        suffix={(
                            <div>
                                <Typography.Text style={{ fontSize: '0.75em' }} type="secondary">
                                    <PlusOutlined />
                                    <HourglassFilled />
                                    {data?.currentRoundClock} min
                                </Typography.Text>
                            </div>
                        )}
                        title="当前轮数"
                        value={data?.currentRound} />
                </Col>
                <Col span={3}>
                    <Statistic loading={isLoading} title="全局抵押额" value={data?.totalStake} />
                </Col>
                <Col span={3}>
                    <Statistic loading={isLoading} title="平均抵押额" value={data?.averageStake} />
                </Col>
                <Col span={6}>
                    <Statistic loading={isLoading} title="在线/所有矿工数" value={`${data?.onlineWorkers ?? '-1'}/${data?.allWorkers ?? '-1'}`} />
                </Col>
            </Row> */}
        </>
    )
}
