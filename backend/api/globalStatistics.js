
import protobuf from '../protobuf/protobuf.js'
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import mongoose from  "../db/mogoose.js"

export async function getGlobalStatistics() {
  let realtimeRoundInfo = await RealtimeRoundInfo.findOne({});
  if (!realtimeRoundInfo) {
    let message = protobuf.GlobalStatisticsResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
    return buffer;
  }

  let rt = { status: { success: 0 } , result: {
     apy: 0, //todo@@ 上一轮from mongodb lastround
     round: realtimeRoundInfo.round,
     roundCycleTime: realtimeRoundInfo.roundCycleTime, 
     onlineWorkerNum: realtimeRoundInfo.onlineWorkerNum,
     workerNum: realtimeRoundInfo.workerNum,
     stakeSum: realtimeRoundInfo.stakeSum.toString(),  //bignum
     stakeSupplyRate: realtimeRoundInfo.stakeSupplyRate,
     avgStake: realtimeRoundInfo.avgStake.toString(),  //bignum
     rewardLastRound: "1279123523", //todo@@ 上一轮from mongodb
  }};

  let message = protobuf.GlobalStatisticsResponse.create(rt);
  let buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
  return buffer;
}