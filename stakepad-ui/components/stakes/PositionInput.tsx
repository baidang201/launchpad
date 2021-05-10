import { BalanceOf } from '@polkadot/types/interfaces'
import { Input } from 'baseui/input'
import { useEffect, ReactElement, useState } from 'react'

const defaultSuffix = 'PHA'
const validFloat = /^\d+(\.\d+)?$/

export const PositionInput = ({ currentPosition, disabled, onChange, zeroizeEvent }: {
    currentPosition?: BalanceOf // current on-chain stake position
    disabled?: boolean
    onChange: (newPosition?: number) => void
    zeroizeEvent?: EventTarget
}): ReactElement => {
    const [suffix, setSuffix] = useState<string>()
    const [value, setValue] = useState<string>('')

    const handleInputChange = (newValue: string): void => {
        setValue(newValue)

        const validation = validFloat.test(newValue)
        setSuffix(validation ? defaultSuffix : undefined)
        onChange(validation ? parseFloat(newValue) : undefined)
    }

    useEffect(() => {
        const handleZeroize = (): void => handleInputChange('0')
        zeroizeEvent?.addEventListener('zeroize', handleZeroize)
        return () => zeroizeEvent?.removeEventListener('zeroize', handleZeroize)
    })

    return (
        <Input
            disabled={disabled === true}
            endEnhancer={<>{suffix}</>}
            placeholder={currentPosition?.toHuman() ?? 'Loading'}
            onChange={e => handleInputChange(e.currentTarget.value)}
            value={value}
        />
    )
}
