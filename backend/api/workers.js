
import {RealtimeRoundInfo} from '../models/realtimeRoundInfo.js'
import protobuf from '../protobuf/protobuf.js'

export async function getWorkers(workerRequest) {
  let realtimeRoundInfo = await RealtimeRoundInfo.findOne({});
  if (!realtimeRoundInfo) {
    let message = protobuf.WorkerResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.WorkerResponse.encode(message).finish();
    return buffer;
  }
  let workers = [];
  for (var worker of realtimeRoundInfo.workers) {
    workers.push({
      stashAccount: worker.stashAccount,
      controllerAccount: worker.controllerAccount,
      payout: worker.payout,
      status: "", // todo
      stakeEnough: true,//todo
      accumulatedStake:  worker.accumulatedStake.toString(),
      profitLastMonth:  "0",//todo
      workerStake: worker.workerStake.toString(),//todo
      userStake: "12345",//todo
      stakeAccountNum: 11,//todo
      commission: worker.commission, //todo not filed in pallet
      taskScore: worker.taskScore,//todo 实时计算，
      machineScore: worker.machineScore,//todo 实时计算，
      apyprofit: worker.apyprofit,//todo 上个round计算
      diffToMinStake: "0",//todo 实时计算，
      stakeToMinApyProfit: 9998//todo 实时计算，
    });
  }

  let message = protobuf.WorkerResponse.create({ status: { success: 0 } , result: {total: workers.length, workers: workers}});
  let buffer = protobuf.WorkerResponse.encode(message).finish();
  return buffer;
}