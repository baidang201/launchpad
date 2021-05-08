import { validateAddress } from '@polkadot/util-crypto'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { ReactElement, useEffect, useMemo, useState } from 'react'

const defaultValidator = (value: string): boolean => { try { return validateAddress(value) } catch { return false } }

export const ValidatedAccountInput = (props: {
    defaultAddress?: string
    disabled?: boolean
    label?: string
    onChange?: (address?: string) => void
    validate?: (value: string) => boolean
}): ReactElement => {
    const { defaultAddress, disabled, label, onChange } = props
    const validate = useMemo(() => props.validate ?? defaultValidator, [props.validate])

    const [address, setAddress] = useState<string>('')
    const [error, setError] = useState<string>()

    useEffect(() => {
        const validation = validate(address)
        setError(validation
            ? undefined
            : address.length === 0
                ? 'Address is required'
                : 'Malformed address')
        onChange?.(validation ? address : undefined)
    }, [address, onChange, validate])

    useEffect(() => setAddress(defaultAddress ?? ''), [defaultAddress])

    return (
        <FormControl error={error} label={label}>
            <Input
                clearable
                disabled={disabled}
                error={error !== undefined}
                onChange={e => setAddress(e.currentTarget.value)}
                value={address}
            />
        </FormControl >
    )
}
