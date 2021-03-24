
import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart, sumEvery, averageEvery} from '../utils/index.js'

export async function getStakeinfo(stakeInfoRequest) {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: 1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.StakeInfoResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.StakeInfoResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkersRule = x => x.stashAccount === stakeInfoRequest.stashAccount;
  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .flat(1)
    .filter(filterWorkersRule)
  
  const accumulatedStakes = averageEvery(filterWorkers.map(x => x.accumulatedStake), 4);
  const workerStakes = averageEvery(filterWorkers.map(x => x.workerStake), 4);

  let rt = { status: { success: 0 } , result: {
    accumulatedStake: padArrayStart(accumulatedStakes.map(x => x.toString()), 180, '0'),
    workerStake: padArrayStart(workerStakes.map(x => x.toString()), 180, '0')
  }};

  let message = protobuf.StakeInfoResponse.create(rt);
  let buffer = protobuf.StakeInfoResponse.encode(message).finish();
  return buffer;
}


export async function getAvgStake() {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: 1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.AvgStakeResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.AvgStakeResponse.encode(message).finish();
    return buffer;
  }

  const avgStakes = averageEvery(historyRoundInfo.map(x => x.avgStake), 4);
  
  let rt = { status: { success: 0 } , result: {
    avgStake: padArrayStart(avgStakes.map(x => x.toString()), 180, '0')
  }};

  let message = protobuf.AvgStakeResponse.create(rt);
  let buffer = protobuf.AvgStakeResponse.encode(message).finish();
  return buffer;
}