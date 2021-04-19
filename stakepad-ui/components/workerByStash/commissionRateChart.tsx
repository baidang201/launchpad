import { EChartsOption } from 'echarts'
import { WorkerDetails, WorkerHistoryPoint } from '../../libs/apis'
import { ChartWithDefaults } from './chart'
import styles from './chart.module.css'

export function CommissionRateChart({ worker: workerDetails }: { worker?: WorkerDetails }): JSX.Element {
    const {
        commissionRate
    } = workerDetails ?? {
        commissionRate: [] as Array<WorkerHistoryPoint<number>>
    }

    const options: EChartsOption = {
        dataset: [
            {
                id: 'commissionRate',
                source: commissionRate.map(point => [point.timestamp, point.value * 100])
            },
            {
                id: 'round',
                source: commissionRate.map(point => [point.timestamp, point.round])
            }
        ],

        series: [
            {
                color: '#D1FF52',
                datasetId: 'commissionRate',
                dimensions: ['时间戳', '分润率'],
                encode: {
                    tooltip: [1],
                    x: [0],
                    y: [1]
                },
                name: '分润率',
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
        ],

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
    }

    return (
        <ChartWithDefaults className={styles.chart} options={options} />
    )
}
