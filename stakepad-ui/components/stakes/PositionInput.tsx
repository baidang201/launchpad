import { BalanceOf } from '@polkadot/types/interfaces'
import { Input } from 'baseui/input'
import { ReactElement, useState } from 'react'

const defaultSuffix = 'PHA'
const validFloat = /^\d+(\.\d+)$/

export const PositionInput = ({ currentPosition, disabled, onChange }: {
    currentPosition?: BalanceOf // current on-chain stake position
    disabled?: boolean
    onChange: (newPosition?: number) => void
}): ReactElement => {
    const [suffix, setSuffix] = useState<string>()

    const handleInputChange = (value: string): void => {
        const validation = validFloat.test(value)
        setSuffix(validation ? defaultSuffix : undefined)
        onChange(validation ? parseFloat(value) : undefined)
    }

    return (
        <Input
            disabled={disabled === true}
            endEnhancer={<>{suffix}</>}
            placeholder={currentPosition?.toHuman() ?? 'Loading'}
            onChange={e => handleInputChange(e.currentTarget.value)}
        />
    )
}
