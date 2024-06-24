import router, { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { InjectedAccountSelect } from '../../../components/accounts/AccountSelect'
import { PositionTable } from '../../../components/stakes/PositionTable'
import { useApiPromise } from '../../../libs/polkadot'
import { useAddressNormalizer } from '../../../libs/queries/useAddressNormalizer'
import { useStakerPendingsQuery } from '../../../libs/queries/usePendingStakeQuery'
import { useStakerPositionsQuery } from '../../../libs/queries/useStakeQuery'

const StakePositionTablePage = (): ReactElement => {
    const [address, setAddress] = useState<string>()

    const { api } = useApiPromise()
    const normalizeAddress = useAddressNormalizer(api)

    const { data: currentPositions } = useStakerPositionsQuery(address, api)
    const { data: currentPendings } = useStakerPendingsQuery(address, api)
    const miners = useMemo(() => [
        // TODO: fix this costly array union
        ...new Set([
            ...Object.keys(currentPositions ?? {}),
            ...Object.keys(currentPendings ?? {})]
        )
    ], [currentPendings, currentPositions])

    const { query: { address: urlAddress } } = useRouter()
    const defaultAddress = useMemo(() => {
        try {
            return typeof urlAddress === 'string' ? normalizeAddress(urlAddress) : undefined
        } catch {
            console.error('[StakePage] Invalid address in URL param:', urlAddress)
            return undefined
        }
    }, [normalizeAddress, urlAddress])

    useEffect(() => {
        if (address !== undefined) {
            const normalized = normalizeAddress(address)
            if (normalized !== urlAddress) {
                router.push(`/accounts/${normalized}/stakes`).catch(error => console.error('Failed to navigate:', error))
            }
        }
    }, [address, normalizeAddress, urlAddress])

    return (<>
        <InjectedAccountSelect defaultAddress={defaultAddress} onChange={setAddress} />

        {address !== undefined && <PositionTable miners={miners} staker={address} />}
    </>)
}

export default StakePositionTablePage
