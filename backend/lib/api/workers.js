
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import protobuf from '../protobuf/protobuf.js'

const BASE_STAKE_PHA = 1620
const COMMISSION_LIMIT = 20

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
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
    const checkfilterRuning = workerRequest.filter_runing? true === element.online_status: true;
    const checkfilterStakeEnough = workerRequest.filter_stake_enough?  element.worker_stake >= BASE_STAKE_PHA : true;
    const checkfilterCommissionLessThen = workerRequest.filter_commission_less_then ? element.commission <= COMMISSION_LIMIT: true
    const checkfilterStashAccounts = (workerRequest.filter_stash_accounts &&  workerRequest.filter_stash_accounts.length > 0) ?
      workerRequest.filter_stash_accounts.indexOf(element.stash_account) >= 0 : true

    return checkfilterRuning && checkfilterStakeEnough && checkfilterCommissionLessThen && checkfilterStashAccounts
  })
  .sort((a, b) => {
    if ( 'profit_last_month' === workerRequest.sort_field_name) {
      return b.profit_last_month - a.profit_last_month
    } else if ( 'accumulated_stake' === workerRequest.sort_field_name) {
      return b.accumulated_stake - a.accumulated_stake
    } else if ( 'commission' === workerRequest.sort_field_name) {
      return b.commission - a.commission
    } else if ( 'task_score' === workerRequest.sort_field_name) {
      return b.task_score - a.task_score
    } else if ( 'machine_score' === workerRequest.sort_field_name) {
      return b.machine_score - a.machine_score
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

    const filterWorkersRule = x => x.stash_account === stashAccount;
    const filterReward = historyRoundInfo.map(roundInfo => roundInfo.workers)
      .flat(1)
      .filter(filterWorkersRule)
      .map(x => x.reward)

    const profitLastMonth = filterReward.reduce((a, b) => a + b, 0)
    return profitLastMonth
  }

  for (const worker of paginate(filterWorkers, workerRequest.page_size, workerRequest.page)) {
    workers.push({
      stash_account: worker.stash_account,
      controller_account: worker.controller_account,
      payout: worker.payout,
      online_status: worker.online_status,
      stake_enough: worker.worker_stake >= BASE_STAKE_PHA? true : false,
      accumulated_stake:  worker.accumulated_stake.toString(),
      profit_last_month:  getProfitLastMonth(historyRoundInfo, worker.stashAccount).toString(),
      worker_stake: worker.worker_stake.toString(),
      user_stake: worker.user_stake.toString(),
      stake_account_num: worker.stake_account_num,
      commission: worker.commission,
      task_score: worker.task_score,
      machine_score: worker.machine_score,
      apy: worker.apy,
      diff_to_min_stake: worker.worker_stake >= BASE_STAKE_PHA? 0 : BASE_STAKE_PHA - worker.worker_stake,
      stake_to_min_apy: 1//todo@@ 基础抵押年化 实时计算 看看产品更新公式
    });
  }

  const message = protobuf.WorkerResponse.create({ status: { success: 0 } , result: {total: total, workers: workers}});
  const buffer = protobuf.WorkerResponse.encode(message).finish();
  return buffer;
}