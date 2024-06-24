import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import { AnnualizedReturnRateChart } from '../../components/charts/annualizedReturnRateChart'
import { CommissionRateChart } from '../../components/charts/commissionRateChart'
import { RewardChart } from '../../components/charts/rewardChart'
import { StakeChart } from '../../components/charts/stakeChart'
import { WorkerInformation } from '../../components/workerByStash/information'
import { getWorkerByStash } from '../../libs/apis/workers'

const WorkerByStashPage: React.FC = () => {
    const router = useRouter()
    const { stash: rawStash } = router.query
    const stash = typeof rawStash === 'string' ? rawStash : rawStash?.[0] ?? ''

    const { data } = useQuery(
        ['api', 'getWorkerByStash', stash],
        async () => await getWorkerByStash(stash)
    )

    return (
        <>
            <WorkerInformation worker={data} />
            <FlexGrid flexGridColumnCount={2}>
                <FlexGridItem>
                    <StakeChart stash={stash} />
                </FlexGridItem>
                <FlexGridItem>
                    <CommissionRateChart stash={stash} />
                </FlexGridItem>
                <FlexGridItem>
                    <RewardChart stash={stash} />
                </FlexGridItem>
                <FlexGridItem>
                    <AnnualizedReturnRateChart stash={stash} />
                </FlexGridItem>
            </FlexGrid>
        </>
    )
}

export default WorkerByStashPage
