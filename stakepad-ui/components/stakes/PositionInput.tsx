import { Balance } from '@polkadot/types/interfaces'
import { Input } from 'baseui/input'
import { Decimal } from 'decimal.js'
import { ReactElement, useEffect, useState } from 'react'

const DecimalZero = new Decimal(0)

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

    const handleInputChange = (newValue: string): void => {
        setValue(newValue)

        if (newValue.length === 0) {
            setError(false)
            onChange(undefined)
        } else {
            const validation = validFloat.test(newValue)
            setError(!validation)
            onChange(validation ? new Decimal(newValue) : undefined)
        }
    }

    useEffect(() => {
        if (targetPosition?.eq(DecimalZero) === true) {
            setValue('0')
        }
    }, [targetPosition])

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
