import { FormControl } from 'baseui/form-control'
import { OnChangeParams, Option as SelectOption, Select } from 'baseui/select'
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '../../libs/polkadot'

export const InjectedAccountSelect = ({ caption, defaultAddress, error, label, onChange }: {
    caption?: ReactNode
    label?: ReactNode

    defaultAddress?: string
    error: boolean
    onChange: (account?: string) => void
}): ReactElement => {
    const { accounts, readystate } = useWeb3()
    const addresses = useMemo(() => accounts?.map(account => account.address) ?? [], [accounts])
    const options = useMemo(() => addresses.map<SelectOption>(accountId => ({
        id: accountId,
        label: accountId
    })), [addresses])

    const [selectValue, setSelectValue] = useState<readonly SelectOption[]>([])

    useEffect(() => {
        setSelectValue([options.find(option => option.id === defaultAddress) as readonly SelectOption[]])
    }, [defaultAddress, options])

    const handleSelectChange = ({ value }: OnChangeParams): void => {
        setSelectValue(value)
        onChange(value[0]?.id?.toString())
    }

    return (
        <FormControl caption={caption} label={label}>
            <Select
                error={error}
                isLoading={readystate !== 'ready'}
                onChange={handleSelectChange}
                options={options}
                value={selectValue}
            />
        </FormControl>
    )
}
