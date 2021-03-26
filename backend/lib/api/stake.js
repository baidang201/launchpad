
import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart, sumEvery, averageEvery} from '../utils/index.js'

export async function getStakeinfo(stakeInfoRequest) {
  const historyRoundInfo = await HistoryRoundInfo
  .find( {'workers.stash_account':  stakeInfoRequest.stash_account})
  .select({'workers.$': 1})
  .sort({round: -1})
  .limit(30*24)
  .lean();//30 days

  if (!historyRoundInfo) {
    const message = protobuf.StakeInfoResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.StakeInfoResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .flat(1)
  
  const accumulatedStakes = averageEvery(filterWorkers.map(x => x.accumulated_stake), 4).reverse();
  const workerStakes = averageEvery(filterWorkers.map(x => x.worker_stake), 4).reverse();

  const rt = { status: { success: 0 } , result: {
    accumulated_stake: padArrayStart(accumulatedStakes.map(x => x.toString()), 180, '0'),
    worker_stake: padArrayStart(workerStakes.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.StakeInfoResponse.create(rt);
  const buffer = protobuf.StakeInfoResponse.encode(message).finish();
  return buffer;
}


export async function getAvgStake() {
  const historyRoundInfo = await HistoryRoundInfo
  .find({})
  .select({avg_stake: 1})
  .sort({round: -1})
  .limit(30*24)
  .lean();//30 days

  if (!historyRoundInfo) {
    const message = protobuf.AvgStakeResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.AvgStakeResponse.encode(message).finish();
    return buffer;
  }

  const avgStakes = averageEvery(historyRoundInfo.map(x => x.avg_stake), 4).reverse();
  
  const rt = { status: { success: 0 } , result: {
    avg_stake: padArrayStart(avgStakes.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.AvgStakeResponse.create(rt);
  const buffer = protobuf.AvgStakeResponse.encode(message).finish();
  return buffer;
}