import { EChartsOption } from 'echarts'
import React, { useMemo } from 'react'
import { WorkerDetails, WorkerHistoryPoint } from '../../libs/apis'
import { ChartWithDefaults } from './chart'
import styles from './chart.module.css'

export function AnnualizedReturnRateChart({ worker: workerDetails }: { worker?: WorkerDetails }): JSX.Element {
    const { annualizedReturnRate } = workerDetails ?? {
        annualizedReturnRate: [] as Array<WorkerHistoryPoint<number>>
    }

    const options: EChartsOption = useMemo(() => ({
        dataset: [{
            source: annualizedReturnRate.map(point => [point.timestamp, point.value * 100, point.round]),
            id: 'annualizedReturnRate'
        }],

        series: [{
            color: '#D1FF52',
            datasetId: 'annualizedReturnRate',
            dimensions: ['时间戳', '年化', '轮数'],
            encode: {
                x: [0],
                y: [1],
                tooltip: [1]
            },
            name: '年化',
            smooth: 0.5,
            type: 'line'
        }, {
            color: '#FFFFFF',
            datasetId: 'annualizedReturnRate',
            dimensions: ['时间戳', '', '轮数'],
            encode: {
                x: [0],
                y: [],
                tooltip: [2]
            },
            name: '轮数',
            renderItem: () => ({ type: 'text' }),
            type: 'custom'
        }],

        yAxis: [{
            axisLabel: {
                formatter: '{value}%'
            },
            scale: true,
            splitLine: {
                lineStyle: {
                    opacity: 0.25
                }
            },
            type: 'value'
        }]
    }), [annualizedReturnRate])

    return (
        <ChartWithDefaults className={styles.chart} options={options} />
    )
}
