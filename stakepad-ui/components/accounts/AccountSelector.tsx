import { FormControl } from 'baseui/form-control'
import { OnChangeParams, Option as SelectOption, Select } from 'baseui/select'
import { ReactElement, ReactNode, useState } from 'react'
import { useWeb3 } from '../../libs/polkadot'

export const InjectedAccountSelect = ({ caption, error, label, onChange }: {
    caption?: ReactNode
    label?: ReactNode

    error: boolean
    onChange: (account?: string) => void
}): ReactElement => {
    const { accounts, readystate } = useWeb3()

    const accountIds = accounts?.map(account => account.address) ?? []

    const options = accountIds.map<SelectOption>(accountId => ({
        id: accountId,
        label: accountId
    }))

    const [selectValue, setSelectValue] = useState<readonly SelectOption[]>([])

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
