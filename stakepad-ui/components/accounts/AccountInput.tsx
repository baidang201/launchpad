import { validateAddress } from '@polkadot/util-crypto'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { ReactElement, useState } from 'react'

const defaultValidator = (value: string): boolean => { try { return validateAddress(value) } catch { return false } }

export const ValidatedAccountInput = (props: {
    label?: string
    onChange?: (address?: string) => void
    validate?: (value: string) => boolean
}): ReactElement => {
    const { label, onChange } = props
    const validate = props.validate ?? defaultValidator

    const [error, setError] = useState<string>()
    const [validation, setValidation] = useState<boolean>(false)

    const handleInputChange = (value: string): void => {
        const validation = validate(value)
        setError(validation
            ? undefined
            : value.length === 0
                ? 'Address is required'
                : 'Malformed address')
        setValidation(validation)
        onChange?.(validation ? value : undefined)
    }

    return (
        <FormControl error={error} label={label} positive={validation}>
            <Input
                clearable
                error={error !== undefined}
                inputRef={input => handleInputChange(input?.value ?? '')} // trigger validation on first mount
                onChange={e => handleInputChange(e.currentTarget.value)}
            />
        </FormControl >
    )
}
