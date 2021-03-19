
import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'

export async function getStakeinfo(stakeInfoRequest) {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.StakeInfoResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.StakeInfoResponse.encode(message).finish();
    return buffer;
  }

  const accumulatedStakes = [];
  const workerStakes = [];

  let rt = { status: { success: 0 } , result: {
    accumulatedStake: accumulatedStakes,
    workerStake: workerStakes
  }};

  let message = protobuf.StakeInfoResponse.create(rt);
  let buffer = protobuf.StakeInfoResponse.encode(message).finish();
  return buffer;
}


export async function getAvgStake() {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.AvgStakeResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.AvgStakeResponse.encode(message).finish();
    return buffer;
  }

  const avgStakes = [];

  let rt = { status: { success: 0 } , result: {
    avgStake: avgStakes
  }};

  let message = protobuf.AvgStakeResponse.create(rt);
  let buffer = protobuf.AvgStakeResponse.encode(message).finish();
  return buffer;
}