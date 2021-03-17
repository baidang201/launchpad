
import protobuf from '../protobuf/protobuf.js'
import {Worker, RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import mongoose from  "../db/mogoose.js"

export async function getGlobalStatistics() {
  let realtimeRoundInfo = await RealtimeRoundInfo.findOne({});
  if (!realtimeRoundInfo) {
    let message = protobuf.GlobalStatisticsResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
    return buffer;
  }

  let rt = { status: { success: 0 } , result: {
     apy: 0,
     round: realtimeRoundInfo.round,
     roundCycleTime: 3, //todo
     onlineWorkerNum: 4, //todo
     workerNum: realtimeRoundInfo.workers.length,
     stakeSum: "189123632356235",  //bignum //todo
     stakeSupplyRate: 22.2,//todo staket / feixiaohao.supply
     avgStake: realtimeRoundInfo.avgStake.toString(),  //bignum
     rewardLastRound: "1279123523", // todo
  }};

  let message = protobuf.GlobalStatisticsResponse.create(rt);
  let buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
  return buffer;

}