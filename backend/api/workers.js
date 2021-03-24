
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import protobuf from '../protobuf/protobuf.js'

const BASE_STAKE_PHA = 1620
const COMMISSION_LIMIT = 20

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export async function getWorkers(workerRequest) {
  let realtimeRoundInfo = await RealtimeRoundInfo.findOne({});
  if (!realtimeRoundInfo) {
    let message = protobuf.WorkerResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.WorkerResponse.encode(message).finish();
    return buffer;
  }
  let workers = [];

  const filterWorkers = realtimeRoundInfo.workers.filter((element, index) => {
    const checkfilterRuning = workerRequest.filterRuning? true: true; // todo input status string
    const checkfilterStakeEnough = workerRequest.filterStakeEnough?  element.workerStake >= BASE_STAKE_PHA : true;
    const checkfilterCommissionLessThen = workerRequest.filterCommissionLessThen ? element.commission <= COMMISSION_LIMIT: true
    const checkfilterStashAccounts = (workerRequest.filterStashAccounts &&  workerRequest.filterStashAccounts.length > 0) ?
      workerRequest.filterStashAccounts.indexOf(element.stashAccount) >= 0 : true

    return checkfilterRuning && checkfilterStakeEnough && checkfilterCommissionLessThen && checkfilterStashAccounts
  })
  .sort((a, b) => {
    if ( 'profitLastMonth' == workerRequest.sortFieldName) {
      return b.profitLastMonth - a.profitLastMonth
    } else if ( 'accumulatedStake' == workerRequest.sortFieldName) {
      return b.accumulatedStake - a.accumulatedStake
    } else if ( 'commission' == workerRequest.sortFieldName) {
      return b.commission - a.commission
    } else if ( 'taskScore' == workerRequest.sortFieldName) {
      return buffer.taskScore - a.taskScore
    } else if ( 'machineScore' == workerRequest.sortFieldName) {
      return b.machineScore - a.machineScore
    } else {
      return a.apy -  b.apy
    }
  })

  const total = filterWorkers.length;

  for (var worker of paginate(filterWorkers, workerRequest.pageSize, workerRequest.page)) {
    workers.push({
      stashAccount: worker.stashAccount,
      controllerAccount: worker.controllerAccount,
      payout: worker.payout,
      status: "", // todo@@ in blockchain
      stakeEnough: worker.workerStake >= BASE_STAKE_PHA? true : false,
      accumulatedStake:  worker.accumulatedStake.toString(),
      profitLastMonth:  "0",//todo@@ 从mongodb计算上个月的
      workerStake: worker.workerStake.toString(),
      userStake: worker.userStake.toString(),
      stakeAccountNum: worker.stakeAccountNum,
      commission: worker.commission,
      taskScore: worker.taskScore,
      machineScore: worker.machineScore,
      apyprofit: worker.apyprofit,//todo@@ 预估年化 实时计算
      diffToMinStake: worker.workerStake >= BASE_STAKE_PHA? 0 : BASE_STAKE_PHA - worker.workerStake,
      stakeToMinApyProfit: 9998//todo@@ 基础抵押年化 实时计算
    });
  }

  let message = protobuf.WorkerResponse.create({ status: { success: 0 } , result: {total: total, workers: workers}});
  let buffer = protobuf.WorkerResponse.encode(message).finish();
  return buffer;
}