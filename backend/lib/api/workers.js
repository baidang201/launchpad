
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import protobuf from '../protobuf/protobuf.js'

const BASE_STAKE_PHA = 1620
const COMMISSION_LIMIT = 20

function paginate(array, pageSize, pageNumber) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export async function getWorkers(workerRequest) {
  const realtimeRoundInfo = await RealtimeRoundInfo.findOne({}).lean();
  if (!realtimeRoundInfo) {
    const message = protobuf.WorkerResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.WorkerResponse.encode(message).finish();
    return buffer;
  }
  const workers = [];

  const filterWorkers = realtimeRoundInfo.workers.filter((element, index) => {
    const checkfilterRuning = workerRequest.filterRuning? true === element.onlineStatus: true;
    const checkfilterStakeEnough = workerRequest.filterStakeEnough?  element.workerStake >= BASE_STAKE_PHA : true;
    const checkfilterCommissionLessThen = workerRequest.filterCommissionLessThen ? element.commission <= COMMISSION_LIMIT: true
    const checkfilterStashAccounts = (workerRequest.filterStashAccounts &&  workerRequest.filterStashAccounts.length > 0) ?
      workerRequest.filterStashAccounts.indexOf(element.stashAccount) >= 0 : true

    return checkfilterRuning && checkfilterStakeEnough && checkfilterCommissionLessThen && checkfilterStashAccounts
  })
  .sort((a, b) => {
    if ( 'profitLastMonth' === workerRequest.sortFieldName) {
      return b.profitLastMonth - a.profitLastMonth
    } else if ( 'accumulatedStake' === workerRequest.sortFieldName) {
      return b.accumulatedStake - a.accumulatedStake
    } else if ( 'commission' === workerRequest.sortFieldName) {
      return b.commission - a.commission
    } else if ( 'taskScore' === workerRequest.sortFieldName) {
      return b.taskScore - a.taskScore
    } else if ( 'machineScore' === workerRequest.sortFieldName) {
      return b.machineScore - a.machineScore
    } else {
      return a.apy -  b.apy
    }
  })

  const total = filterWorkers.length;

  const historyRoundInfo = await HistoryRoundInfo
  .find({})
  .select({'workers.reward': 1, 'workers.stashAccount': 1})
  .sort({round: -1})
  .limit(30*24)
  .lean();//30 days

  //todo add chache in mongodb  or count key in paginate(filterWorkers, workerRequest.pageSize, workerRequest.page)
  function getProfitLastMonth(historyRoundInfo, stashAccount) {
    if (!historyRoundInfo) {
      return 0
    }

    const filterWorkersRule = x => x.stashAccount === stashAccount;
    const filterReward = historyRoundInfo.map(roundInfo => roundInfo.workers)
      .flat(1)
      .filter(filterWorkersRule)
      .map(x => x.reward)

    const profitLastMonth = filterReward.reduce((a, b) => a + b, 0)
    return profitLastMonth
  }

  for (const worker of paginate(filterWorkers, workerRequest.pageSize, workerRequest.page)) {
    workers.push({
      stashAccount: worker.stashAccount,
      controllerAccount: worker.controllerAccount,
      payout: worker.payout,
      onlineStatus: worker.onlineStatus,
      stakeEnough: worker.workerStake >= BASE_STAKE_PHA? true : false,
      accumulatedStake:  worker.accumulatedStake.toString(),
      profitLastMonth:  getProfitLastMonth(historyRoundInfo, worker.stashAccount).toString(),
      workerStake: worker.workerStake.toString(),
      userStake: worker.userStake.toString(),
      stakeAccountNum: worker.stakeAccountNum,
      commission: worker.commission,
      taskScore: worker.taskScore,
      machineScore: worker.machineScore,
      apy: worker.apy,
      diffToMinStake: worker.workerStake >= BASE_STAKE_PHA? 0 : BASE_STAKE_PHA - worker.workerStake,
      stakeToMinApy: 1//todo@@ 基础抵押年化 实时计算 看看产品更新公式
    });
  }

  const message = protobuf.WorkerResponse.create({ status: { success: 0 } , result: {total: total, workers: workers}});
  const buffer = protobuf.WorkerResponse.encode(message).finish();
  return buffer;
}