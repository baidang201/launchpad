import { Typography } from 'antd'
import Space from 'antd/lib/space'
import Switch from 'antd/lib/switch'
import React, { ReactElement, useRef } from 'react'
import { FindWorkerFilters } from '../../../libs/apis/workers'
import styles from './FindFilterSwitches.module.css'

const SwitchWithLabel = ({ checked, disabled, setChecked, title }: {
    checked: boolean
    disabled?: boolean
    setChecked: (value: boolean) => void
    title: string
}): ReactElement => {
    const element = useRef<HTMLElement>(null)

    return (
        <Space className={styles.switchContainer}>
            <Switch
                className={styles.switch}
                checked={checked}
                disabled={disabled}
                onChange={a => setChecked(a)}
                ref={element}
                title={title}
            />
            <Typography.Text
                // className={colors.StandardWh01}
                onClick={() => element.current?.click()}
            >
                {title}
            </Typography.Text>
        </Space>
    )
}

export const FindFilterSwitches = ({ currentFilters, onFilterChanged }: {
    currentFilters: FindWorkerFilters
    onFilterChanged: (filters: FindWorkerFilters) => void
}): ReactElement => {
    const { commissionRateLessThan20, mining, stakePending } = currentFilters

    const update = (update: Partial<FindWorkerFilters>): void => {
        onFilterChanged(Object.assign({}, currentFilters, update))
    }

    return (
        <Space size="small">
            <SwitchWithLabel
                checked={commissionRateLessThan20}
                setChecked={value => update({ commissionRateLessThan20: value })}
                title="不超过 20 % 分润"
            />
            <SwitchWithLabel
                checked={stakePending}
                setChecked={value => update({ stakePending: value })}
                title="未满足基础抵押"
            />
            <SwitchWithLabel
                checked={mining}
                setChecked={value => update({ mining: value })}
                title="运行中"
            />
            <SwitchWithLabel
                checked={false}
                disabled
                setChecked={() => { }}
                title="标记"
            />
        </Space >
    )
}

export default FindFilterSwitches
