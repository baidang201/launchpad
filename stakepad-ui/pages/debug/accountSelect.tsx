import React, { useState, ReactElement } from 'react'

import { InjectedAccountSelect, InjectedAccountSelectWithStakeWalletBalance } from '../../components/accounts/AccountSelect'
import { useApiPromise } from '../../libs/polkadot'

const AccountSelectPage = (): ReactElement => {
    const { api } = useApiPromise()

    const [address, setAddress] = useState<string>()

    return (
        <>
            <p>API: {api !== undefined ? '✔' : '×'}</p>
            <p>Selected Address: {address}</p>
            <InjectedAccountSelect onChange={setAddress} />
            <InjectedAccountSelectWithStakeWalletBalance onChange={setAddress} />
        </>
    )
}

export default AccountSelectPage
