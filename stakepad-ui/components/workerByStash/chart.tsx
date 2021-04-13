import * as ECharts from 'echarts'
import { EChartsOption } from 'echarts'
import { useEffect, useMemo, useState } from 'react'

// TODO: performance optimization
/*
    chart configuration (axes, styling, etc.) should be set only once, via `echarts.init`
    following setOption should update only datasets
*/

export function Chart({ options, ...props }: { options: EChartsOption } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element {
    const [echartsElement, setEchartsElement] = useState<HTMLDivElement | null>(null)
    const echarts = useMemo(() => {
        return echartsElement === null ? null : ECharts.init(echartsElement)
    }, [echartsElement])

    useEffect(() => {
        // update EChart options

        echarts?.setOption(options)
    }, [echarts, options])

    useEffect(() => {
        // responsive resize

        if (window === undefined) {
            return
        }

        const resizeListener = (): void => echarts?.resize()

        window.addEventListener('resize', resizeListener)
        resizeListener() // also call once on mounted

        return () => { window.removeEventListener('resize', resizeListener) }
    }, [echarts, echartsElement?.clientWidth])

    return (
        <div ref={(div) => setEchartsElement(div)} {...props} />
    )
}

export const ChartWithDefaults = ({ options, ...props }: { options: EChartsOption } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
    const optionWithDefaults = Object.assign({}, {
        backgroundColor: '#000000',

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

        xAxis: [{
            name: '时间戳',
            position: 'bottom',
            type: 'time'
        }],

        yAxis: [{
            scale: true,
            splitLine: {
                lineStyle: {
                    opacity: 0.25
                }
            },
            type: 'value'
        }]
    }, options)

    return (
        <Chart options={optionWithDefaults} {...props} />
    )
}
