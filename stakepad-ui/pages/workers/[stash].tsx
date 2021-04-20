import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import { AnnualizedReturnRateChart } from '../../components/workerByStash/annualizedReturnRateChart'
import { CommissionRateChart } from '../../components/workerByStash/commissionRateChart'
import { RewardChart } from '../../components/workerByStash/rewardChart'
import { StakeChart } from '../../components/workerByStash/stakeChart'
import { getWorkerByStash } from '../../libs/apis/workers'
import { WorkerInformation } from '../../components/workerByStash/information'

const WorkerByStashPage: React.FC = () => {
    const router = useRouter()
    const { stash } = router.query

    const { data } = useQuery(
        ['api', 'getWorkerByStash', stash],
        async () => await getWorkerByStash(stash instanceof Array ? stash[0] : stash)
    )

    return (
        <>
            <WorkerInformation worker={data} />
            <FlexGrid flexGridColumnCount={2}>
                <FlexGridItem>
                    <StakeChart worker={data} />
                </FlexGridItem>
                <FlexGridItem>
                    <CommissionRateChart worker={data} />
                </FlexGridItem>
                <FlexGridItem>
                    <RewardChart worker={data} />
                </FlexGridItem>
                <FlexGridItem>
                    <AnnualizedReturnRateChart worker={data} />
                </FlexGridItem>
            </FlexGrid>
        </>
    )
}

export default WorkerByStashPage
