import { EChartsOption } from 'echarts'
import React from 'react'
import { GlobalRewardHistoryPoint, WorkerDetails, WorkerRewardHistoryPoint } from '../../libs/apis'
import { ChartWithDefaults } from './chart'
import styles from './chart.module.css'

export function RewardChart({ worker: workerDetails }: { worker?: WorkerDetails }): JSX.Element {
    const {
        globalRewardHistory: global,
        workerRewardHistory: worker
    } = workerDetails ?? {
        globalRewardHistory: [] as GlobalRewardHistoryPoint[],
        workerRewardHistory: [] as WorkerRewardHistoryPoint[]
    }

    const options: EChartsOption = {
        dataset: [
            {
                id: 'global',
                source: global.map(point => [point.timestamp, point.reward])
            }, {
                id: 'worker',
                source: worker.map(point => [point.timestamp, point.reward, point.penalty])
            }, {
                id: 'round',
                source: global.map(point => [point.timestamp, point.round])
            }
        ],

        series: [
            {
                color: '#64EEAC',
                datasetId: 'global',
                dimensions: ['时间戳', '全局平均收益'],
                encode: {
                    tooltip: [1],
                    x: [0],
                    y: [1]
                },
                name: '全局平均收益',
                smooth: true,
                type: 'line'
            }, {
                color: '#EB5757',
                datasetId: 'worker',
                dimensions: ['时间戳', '矿机奖励'],
                encode: {
                    tooltip: [1],
                    x: [0],
                    y: [1]
                },
                name: '矿机收益',
                smooth: true,
                type: 'line'
            }, {
                color: '#D1FF52',
                datasetId: 'worker',
                dimensions: ['时间戳', '', '矿机惩罚'],
                encode: {
                    tooltip: [2],
                    x: [0],
                    y: [2]
                },
                name: '矿机惩罚',
                smooth: true,
                type: 'line'
            }, {
                color: '#FFFFFF',
                datasetId: 'round',
                dimensions: ['时间戳', '轮数'],
                encode: {
                    tooltip: [2],
                    x: [0],
                    y: []
                },
                name: '轮数',
                renderItem: () => ({ type: 'text' }),
                type: 'custom'
            }
        ]
    }

    return (
        <ChartWithDefaults className={styles.chart} options={options} />
    )
}
