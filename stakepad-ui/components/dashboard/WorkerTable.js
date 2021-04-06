import {Table} from 'antd'

const dataSource = [
  {
    key: '1',
    stashAccount: '42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q',
    monthlyIncome: 1234,
    apy: '70%',
  },
  {
    key: '2',
    stashAccount: '42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5j',
    monthlyIncome: 23432,
    apy: '200%',
  },
];

const columns = [
  {
    title: '账户',
    dataIndex: 'stashAccount',
    key: 'stashAccount',
  },
  {
    title: '月收益',
    dataIndex: 'monthlyIncome',
    key: 'monthlyIncome',
  },
  {
    title: '年化',
    dataIndex: 'apy',
    key: 'apy',
  },
];

function WorkerTable() {
  return <Table dataSource={dataSource} columns={columns} />;
}

export default WorkerTable