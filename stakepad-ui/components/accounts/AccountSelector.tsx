import { FormControl } from 'baseui/form-control'
import { Option as SelectOption, Select } from 'baseui/select'
import { ReactElement, ReactNode, useState } from 'react'
import { useWeb3 } from '../../libs/polkadot'

export const AccountSelect = ({ caption, label, onChange }: {
    caption: ReactNode
    label: ReactNode
    onChange: (account?: string) => void
}): ReactElement => {
    const { accounts, readystate } = useWeb3()

    const accountIds = accounts?.map(account => account.address) ?? []

    const options = accountIds.map<SelectOption>(accountId => ({
        id: accountId,
        label: accountId
    }))

    const [value, setValue] = useState<readonly SelectOption[]>([])

    return (
        <FormControl caption={caption} label={label}>
            <Select
                isLoading={readystate !== 'ready'}
                onChange={value => {
                    setValue(value.value)
                    onChange(value.value[0]?.id?.toString())
                }}
                options={options}
                value={value}
            />
        </FormControl>
    )
}
