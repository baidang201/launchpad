import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart, sumEvery, averageEvery} from '../utils/index.js'

export async function getRewardPenalty(rewardPenaltyRequest) {
  const historyRoundInfo = await HistoryRoundInfo
  .find( {'workers.stash_account':  rewardPenaltyRequest.stash_account})
  .select({'workers.$': 1})
  .sort({round: -1})
  .limit(30*24)
  .lean();//30 days
  if (!historyRoundInfo) {
    const message = protobuf.RewardPenaltyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .flat(1)

  const rewards = sumEvery(filterWorkers.map(x => x.reward), 4).reverse();
  const penaltys = sumEvery(filterWorkers.map(x => x.penalty), 4).reverse();

  const rt = { status: { success: 0 } , result: {
    reward: padArrayStart(rewards.map(x => x.toString()), 180, '0'),
    penalty: padArrayStart(penaltys.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.RewardPenaltyResponse.create(rt);
  const buffer = protobuf.RewardPenaltyResponse.encode(message).finish();
  return buffer;
}

export async function getAvgReward() {
  const historyRoundInfo = await HistoryRoundInfo
  .find({})
  .select({avg_reward: 1})
  .sort({round: -1})
  .limit(30*24)
  .lean();//30 days

  if (!historyRoundInfo) {
    const message = protobuf.AvgRewardResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.AvgRewardResponse.encode(message).finish();
    return buffer;
  }

  const avgrewards = sumEvery(historyRoundInfo.map(x => x.avg_reward), 4).reverse();

  const rt = { status: { success: 0 } , result: {
    avg_reward: padArrayStart(avgrewards.map(x => x.toString()), 180, '0')
  }};

  const message = protobuf.AvgRewardResponse.create(rt);
  const buffer = protobuf.AvgRewardResponse.encode(message).finish();
  return buffer;
}