import { Balance } from '@polkadot/types/interfaces'
import { Input } from 'baseui/input'
import { Decimal } from 'decimal.js'
import { ReactElement, useCallback, useEffect, useState } from 'react'

const defaultSuffix = 'PHA'
const validFloat = /^\d+(\.(\d+)?)?$/

export const PositionInput = ({ currentPosition, disabled, onChange, targetPosition }: {
    currentPosition?: Balance // current on-chain stake position
    disabled?: boolean
    onChange: (newPosition?: Decimal) => void
    targetPosition?: Decimal
}): ReactElement => {
    const [error, setError] = useState<boolean>(false)
    const [value, setValue] = useState<string>('')

    const handleInputChange = useCallback((newValue: string): void => {
        setValue(newValue)

        if (newValue.length === 0) {
            setError(false)
            onChange(undefined)
        } else {
            const validation = validFloat.test(newValue)
            setError(!validation)
            onChange(validation ? new Decimal(newValue) : undefined)
        }
    }, [onChange])

    useEffect(() => {
        if (targetPosition === undefined) {
            setValue('')
        }

        if (targetPosition?.isZero() === true) {
            setValue('0')
        }
    }, [handleInputChange, targetPosition])

    return (
        <Input
            disabled={disabled === true}
            endEnhancer={<>{targetPosition === undefined && defaultSuffix}</>}
            error={error}
            placeholder={currentPosition?.toHuman() ?? 'Loading'}
            onChange={e => handleInputChange(e.currentTarget.value)}
            value={value}
        />
    )
}
