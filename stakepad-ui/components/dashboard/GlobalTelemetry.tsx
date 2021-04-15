import { HourglassFilled, PlusOutlined } from '@ant-design/icons'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Statistic from 'antd/lib/statistic'
import Typography from 'antd/lib/typography'
import { useQuery } from 'react-query'
import { getGlobalTelemetry } from '../../libs/apis/globalTelemetry'

export const GlobalTelemetry: React.FC = () => {
    const { data, isFetched } = useQuery(['api', 'getGlobalTelemetry'], async () => await getGlobalTelemetry())

    const isLoading = !isFetched

    return (
        <Row>
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
        </Row>
    )
}
