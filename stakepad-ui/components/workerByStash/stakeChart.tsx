import { EChartsOption } from 'echarts'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { WorkerStakeHistoryPoint } from '../../libs/apis'
import { getStakeHistoryByStash } from '../../libs/apis/workers'
import { ChartWithDefaults } from './chart'
import styles from './chart.module.css'

export function StakeChart({ stash }: { stash?: string }): JSX.Element {
    const { data, isFetched } = useQuery<WorkerStakeHistoryPoint[]>(
        ['api', 'getStakeHistoryByStash', stash],
        async () => typeof stash === 'string' ? getStakeHistoryByStash(stash) : []
    )

    const global = []
    const worker = data ?? []

    const options: EChartsOption = useMemo(
        () => ({
            dataset: [
                {
                    source: global.map((point) => [
                        point.timestamp,
                        point.stake,
                        point.round
                    ]),
                    id: 'global'
                },
                {
                    source: worker.map((point) => [
                        point.timestamp,
                        point.totalStake,
                        point.ownerStake
                    ]),
                    id: 'worker'
                }
            ],

            series: [
                {
                    color: '#64EEAC',
                    datasetId: 'global',
                    dimensions: ['时间戳', '全局平均总抵押量'],
                    encode: {
                        x: [0],
                        y: [1],
                        tooltip: [1]
                    },
                    name: '全局平均总抵押量',
                    smooth: 0.5,
                    type: 'line'
                },
                {
                    color: '#EB5757',
                    datasetId: 'worker',
                    dimensions: ['时间戳', '矿机总抵押量'],
                    encode: {
                        x: [0],
                        y: [1],
                        tooltip: [1]
                    },
                    name: '矿机总抵押量',
                    smooth: 0.5,
                    type: 'line'
                },
                {
                    color: '#D1FF52',
                    datasetId: 'worker',
                    dimensions: ['时间戳', '', '矿机自带抵押量'],
                    encode: {
                        x: [0],
                        y: [2],
                        tooltip: [2]
                    },
                    name: '矿机自带抵押量',
                    smooth: 0.5,
                    type: 'line'
                },
                {
                    color: '#FFFFFF',
                    datasetId: 'global',
                    dimensions: ['时间戳', '', '轮数'],
                    encode: {
                        x: [0],
                        y: [],
                        tooltip: [2]
                    },
                    name: '轮数',
                    renderItem: () => ({ type: 'text' }),
                    type: 'custom'
                }
            ]
        }),
        [global, worker]
    )

    return (<ChartWithDefaults className={styles.chart} options={options} />)
}
