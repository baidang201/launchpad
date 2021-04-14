import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Space from 'antd/lib/space'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { AnnualizedReturnRateChart } from '../../components/workerByStash/annualizedReturnRateChart'
import { CommissionRateChart } from '../../components/workerByStash/commissionRateChart'
import { WorkerInformation } from '../../components/workerByStash/information'
import { RewardChart } from '../../components/workerByStash/rewardChart'
import { StakeChart } from '../../components/workerByStash/stakeChart'
import { getWorkerByStash } from '../../libs/apis/getWorkerByStash'
import styles from '../../styles/pages/workers/[stash].module.css'

const WorkerByStashPage: React.FC = () => {
    const router = useRouter()
    const { stash } = router.query

    const { data } = useQuery(
        ['api', 'getWorkerByStash', stash],
        async () => await getWorkerByStash()
    )

    return (
        <Space className={styles.container} direction="vertical" size="large">
            <WorkerInformation worker={data} />
            <Row>
                <Col xs={24} lg={12}>
                    <StakeChart worker={data} />
                </Col>
                <Col xs={24} lg={12}>
                    <CommissionRateChart worker={data} />
                </Col>
            </Row>
            <Row>
                <Col xs={24} lg={12}>
                    <RewardChart worker={data} />
                </Col>
                <Col xs={24} lg={12}>
                    <AnnualizedReturnRateChart worker={data} />
                </Col>
            </Row>
        </Space>
    )
}

export default WorkerByStashPage
