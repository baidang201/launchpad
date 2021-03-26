
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
    return historyRoundInfo.apy_current_round;
  }

  const rt = { status: { success: 0 } , result: {
     apy: await getLastRoundApy(realtimeRoundInfo.round),
     round: realtimeRoundInfo.round,
     round_cycle_time: realtimeRoundInfo.round_cycle_time, 
     online_worker_num: realtimeRoundInfo.online_worker_num,
     worker_num: realtimeRoundInfo.worker_num,
     stake_sum: realtimeRoundInfo.stake_sum.toString(),  //bignum
     stake_supply_rate: realtimeRoundInfo.stake_supply_rate,
     avg_stake: realtimeRoundInfo.avg_stake.toString(),  //bignum
     reward_last_round: realtimeRoundInfo.reward_last_round.toString(),
  }};

  const message = protobuf.GlobalStatisticsResponse.create(rt);
  const buffer = protobuf.GlobalStatisticsResponse.encode(message).finish();
  return buffer;
}