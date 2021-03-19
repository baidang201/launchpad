import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'

export async function getRewardPenalty(rewardPenaltyRequest) {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.RewardPenaltyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
    return buffer;
  }

  const rewards = [];
  const penaltys = [];

  let rt = { status: { success: 0 } , result: {
    reward: rewards,
    penalty: penaltys
  }};

  let message = protobuf.RewardPenaltyResponse.create(rt);
  let buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
  return buffer;
}

export async function getAvgReward() {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.AvgRewardResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.AvgRewardResponse.encode(message).finish();
    return buffer;
  }

  const avgrewards = [];

  let rt = { status: { success: 0 } , result: {
    avgreward: avgrewards
  }};

  let message = protobuf.AvgRewardResponse.create(rt);
  let buffer = protobuf.AvgRewardResponse.encode(message).finish();
  return buffer;
}