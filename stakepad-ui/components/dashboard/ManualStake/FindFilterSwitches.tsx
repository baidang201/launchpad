import { Checkbox, STYLE_TYPE } from 'baseui/checkbox'
import React, { ReactElement } from 'react'
import { FindWorkerFilters } from '../../../libs/apis/workers'

const SwitchWithLabel = ({ checked, disabled, setChecked, title }: {
    checked: boolean
    disabled?: boolean
    setChecked: (value: boolean) => void
    title: string
}): ReactElement => {
    return (
        <Checkbox
            checked={checked}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement="right"
            disabled={disabled}
            onChange={e => setChecked((e.target as HTMLInputElement).checked)}
            overrides={{
                Root: {
                    style: () => ({ padding: '0.75em 0.25em' })
                },
                Label: {
                    style: () => ({ paddingLeft: '0em' })
                }
            }}
        >
            {title}
        </Checkbox>
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
        <>
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
        </>
    )
}

export default FindFilterSwitches
