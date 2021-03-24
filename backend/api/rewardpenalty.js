import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart, sumEvery, averageEvery} from '../utils/index.js'

export async function getRewardPenalty(rewardPenaltyRequest) {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: 1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.RewardPenaltyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkersRule = x => x.stashAccount === rewardPenaltyRequest.stashAccount;
  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .flat(1)
    .filter(filterWorkersRule)

  const rewards = sumEvery(filterWorkers.map(x => x.reward), 4);
  const penaltys = sumEvery(filterWorkers.map(x => x.penalty), 4);

  let rt = { status: { success: 0 } , result: {
    reward: padArrayStart(rewards.map(x => x.toString()), 180, '0'),
    penalty: padArrayStart(penaltys.map(x => x.toString()), 180, '0')
  }};

  let message = protobuf.RewardPenaltyResponse.create(rt);
  let buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
  return buffer;
}

export async function getAvgReward() {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: 1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.AvgRewardResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.AvgRewardResponse.encode(message).finish();
    return buffer;
  }
  const filterAvgReward = historyRoundInfo.filter((element, index) => {
    return 0 == index % 3
  });

  const avgrewards = filterAvgReward.map(x => x.avgreward.toString())

  let rt = { status: { success: 0 } , result: {
    avgreward: padArrayStart(avgrewards, 180, '0')
  }};

  let message = protobuf.AvgRewardResponse.create(rt);
  let buffer = protobuf.AvgRewardResponse.encode(message).finish();
  return buffer;
}