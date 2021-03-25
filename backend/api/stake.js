
import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart, sumEvery, averageEvery} from '../utils/index.js'

export async function getStakeinfo(stakeInfoRequest) {
  const historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//30 days
  if (!historyRoundInfo) {
    const message = protobuf.StakeInfoResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.StakeInfoResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkersRule = x => x.stashAccount === stakeInfoRequest.stashAccount;
  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .flat(1)
    .filter(filterWorkersRule)
  
  const accumulatedStakes = averageEvery(filterWorkers.map(x => x.accumulatedStake), 4).reverse();
  const workerStakes = averageEvery(filterWorkers.map(x => x.workerStake), 4).reverse();

  const rt = { status: { success: 0 } , result: {
    accumulatedStake: padArrayStart(accumulatedStakes.map(x => x.toString()), 180, '0'),
    workerStake: padArrayStart(workerStakes.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.StakeInfoResponse.create(rt);
  const buffer = protobuf.StakeInfoResponse.encode(message).finish();
  return buffer;
}


export async function getAvgStake() {
  const historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//30 days
  if (!historyRoundInfo) {
    const message = protobuf.AvgStakeResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.AvgStakeResponse.encode(message).finish();
    return buffer;
  }

  const avgStakes = averageEvery(historyRoundInfo.map(x => x.avgStake), 4).reverse();
  
  const rt = { status: { success: 0 } , result: {
    avgStake: padArrayStart(avgStakes.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.AvgStakeResponse.create(rt);
  const buffer = protobuf.AvgStakeResponse.encode(message).finish();
  return buffer;
}