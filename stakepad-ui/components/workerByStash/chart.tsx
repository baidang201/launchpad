import * as ECharts from 'echarts'
import { DatasetComponentOption, EChartsOption } from 'echarts'
import { useEffect, useMemo, useState } from 'react'

interface ChartProps {
    dataset?: DatasetComponentOption[]
    options: EChartsOption
}

export function Chart({ dataset, options, ...props }: ChartProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element {
    const [echartsElement, setEchartsElement] = useState<HTMLDivElement | null>(null)
    const echarts = useMemo(() => {
        if (echartsElement === null || typeof window === 'undefined') {
            return
        }

        return ECharts.init(echartsElement)
    }, [echartsElement])

    useEffect(() => {
        // update echarts dataset

        typeof setImmediate === 'function' && setImmediate(() => {
            echarts?.setOption({ dataset }, { lazyUpdate: true })
        })
    }, [echarts, dataset])

    useEffect(() => {
        // update echarts options

        typeof setImmediate === 'function' && setImmediate(() => {
            echarts?.setOption(options)
        })
    }, [echarts, options])

    useEffect(() => {
        // responsive resize

        if (window === undefined) {
            return
        }

        const resizeListener = (): void => echarts?.resize()

        window.addEventListener('resize', resizeListener)
        resizeListener() // also call once on mounted

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [echarts, echartsElement?.clientWidth])

    return <div ref={(div) => setEchartsElement(div)} {...props} />
}

export const ChartWithDefaults = ({
    options,
    ...props
}: ChartProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
    const defaults: EChartsOption = {
        backgroundColor: '#000000',

        grid: {
            bottom: 32,
            top: 16
        },

        tooltip: {
            axisPointer: {
                snap: true,
                type: 'line'
            },
            textStyle: {
                fontSize: 12
            },
            trigger: 'axis'
        },

        xAxis: [
            {
                name: '时间戳',
                position: 'bottom',
                type: 'time'
            }
        ],

        yAxis: [
            {
                scale: true,
                splitLine: {
                    lineStyle: {
                        opacity: 0.25
                    }
                },
                type: 'value'
            }
        ]
    }

    const optionWithDefaults = Object.assign({}, defaults, options)

    return <Chart options={optionWithDefaults} {...props} />
}
