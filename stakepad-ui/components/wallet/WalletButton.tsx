import { CheckOutlined, DownOutlined, LoadingOutlined, MinusOutlined, WalletOutlined } from '@ant-design/icons'
import { ApiPromise } from '@polkadot/api'
import { AccountInfo } from '@polkadot/types/interfaces'
import Button from "antd/lib/button"
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Text from 'antd/lib/typography/Text'
import React, { MouseEventHandler, useMemo } from "react"
import { useQuery } from "react-query"
import { usePolkadot } from "../../libs/polkadot"

const useBalanceQuery = (accountId?: string, api?: ApiPromise) => useQuery(
    ['polkadot/balance', accountId, api === undefined],
    async () => {
        if (api === undefined || accountId === undefined) {
            // API is not enabled yet
            return undefined
        }

        const { data: { free } } = await api.query.system.account(accountId) as AccountInfo
        return free.toHuman()
    }
)

const ConnectButton: React.FC<{ onClick: MouseEventHandler<Element> }> = ({ onClick }) => (
    <Button type="primary" icon={<WalletOutlined />} onClick={onClick}>Connect</Button>
)

const ConnectedAccountItem: React.FC<{ accountId: string }> = ({ accountId }) => {
    const { api } = usePolkadot()
    const { data: balance, isFetching: isFetchingBalance } = useBalanceQuery(accountId, api)

    return (
        <>{accountId} <Text type="secondary">{isFetchingBalance ? <LoadingOutlined /> : (balance ?? 'N/A')} PHA</Text></>
    )
}

const Connected: React.FC = () => {
    const { account: selectedAccount, accounts, api } = usePolkadot()

    // currently selected account 

    const { data: balance, isFetching: isFetchingBalance } = useBalanceQuery(selectedAccount, api)

    // available accounts

    const menuItems = useMemo(() => accounts?.map(account => (
        <Menu.Item icon={account.address === selectedAccount ? <CheckOutlined /> : <MinusOutlined />} key={account.address}>
            <ConnectedAccountItem accountId={account.address} />
        </Menu.Item>
    )) ?? [], [accounts])

    const menu = (
        <Menu selectedKeys={typeof selectedAccount === 'string' ? [selectedAccount] : undefined}>
            {menuItems}
        </Menu>
    )

    return (
        <Dropdown overlay={menu}>
            <Button icon={<WalletOutlined />}>
                {isFetchingBalance ? <LoadingOutlined /> : (balance ?? 'N/A')} PHA <DownOutlined />
            </Button>
        </Dropdown>
    )
}

const Connecting: React.FC = () => (
    <Button loading type="primary">Please wait</Button>
)

export const WalletButton: React.FC = ({ }) => {
    const { enableWeb3, readystate } = usePolkadot()

    switch (readystate) {
        case 'init':
            return <Connecting />
        case 'ready':
            return <Connected />
        case 'start':
            return <ConnectButton onClick={() => enableWeb3()} />
        default:
            return <div>not implemented readystate {readystate}</div>
    }
}