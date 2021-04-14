
import protobuf from '../protobuf/protobuf.js'
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'


export async function getGlobalStatistics() {
  const realtimeRoundInfo = await RealtimeRoundInfo.findOne({}).lean();
  if (!realtimeRoundInfo) {
    const message = protobuf.GlobalStatisticsResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
    return buffer;
  }

  async function getLastRoundApy(round) {
    const historyRoundInfo = await HistoryRoundInfo.findOne({round: round - 1});
    if (!historyRoundInfo) {
      return 0;
    }
    return historyRoundInfo.apyCurrentRound;
  }

  const rt = { status: { success: 0 } , result: {
     apy: await getLastRoundApy(realtimeRoundInfo.round),
     round: realtimeRoundInfo.round,
     roundCycleTime: realtimeRoundInfo.roundCycleTime, 
     onlineWorkerNum: realtimeRoundInfo.onlineWorkerNum,
     workerNum: realtimeRoundInfo.workerNum,
     stakeSum: realtimeRoundInfo.stakeSum.toString(),  //bignum
     stakeSupplyRate: realtimeRoundInfo.stakeSupplyRate,
     avgStake: realtimeRoundInfo.avgStake.toString(),  //bignum
     rewardLastRound: realtimeRoundInfo.rewardLastRound.toString(),
  }};

  const message = protobuf.GlobalStatisticsResponse.create(rt);
  const buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
  return buffer;
}