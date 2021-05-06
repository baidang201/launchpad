import { BalanceOf } from '@polkadot/types/interfaces'
import { validateAddress } from '@polkadot/util-crypto'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { useRouter } from 'next/router'
import React, { ReactElement, useMemo, useState } from 'react'
import { InjectedAccountSelect } from '../../../components/accounts/AccountSelect'
import { useApiPromise } from '../../../libs/polkadot'
import { useStakesByStakerQuery } from '../../../libs/queries/useStakeQuery'

const StakedPage = (): ReactElement => {
    const [address, setAddress] = useState<string>()

    const { api } = useApiPromise()
    const { data } = useStakesByStakerQuery(address, api)

    const entries = useMemo(() => Object.entries(data ?? {}), [data])

    const { query: { address: urlAddress } } = useRouter()
    const defaultAddress = useMemo(() => {
        try {
            console.log('urlAddress=', urlAddress)
            return typeof urlAddress === 'string' && validateAddress(urlAddress) ? urlAddress : undefined
        } catch {
            console.error('Invalid address in URL param:', urlAddress)
            return undefined
        }
    }, [urlAddress])

    return (<>
        <InjectedAccountSelect defaultAddress={defaultAddress} onChange={setAddress} />

        <TableBuilder data={entries}>
            <TableBuilderColumn header="矿机地址">{([address]: [string, BalanceOf]) => <>{address}</>}</TableBuilderColumn>
            <TableBuilderColumn header="我的抵押额">{([, amount]: [string, BalanceOf]) => <>{amount.toHuman()}</>}</TableBuilderColumn>
        </TableBuilder>
    </>)
}

export default StakedPage
