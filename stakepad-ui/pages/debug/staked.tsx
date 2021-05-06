import { BalanceOf } from '@polkadot/types/interfaces'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import React, { ReactElement, useMemo, useState } from 'react'
import { InjectedAccountSelect } from '../../components/accounts/AccountSelect'
import { useApiPromise } from '../../libs/polkadot'
import { useStakedByQuery } from '../../libs/queries/useStakeQuery'

const StakedPage = (): ReactElement => {
    const [address, setAddress] = useState<string>()

    const { api } = useApiPromise()
    const { data } = useStakedByQuery(address, api)

    const entries = useMemo(() => Object.entries(data ?? {}), [data])

    return (<>
        <InjectedAccountSelect onChange={setAddress} />

        <TableBuilder data={entries}>
            <TableBuilderColumn>{([address]: [string, BalanceOf]) => <>{address}</>}</TableBuilderColumn>
            <TableBuilderColumn>{([, amount]: [string, BalanceOf]) => <>{amount.toHuman()}</>}</TableBuilderColumn>
        </TableBuilder>
    </>)
}

export default StakedPage
