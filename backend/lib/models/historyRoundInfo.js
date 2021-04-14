import mongoose from  "../../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stashAccount: {type: String, index: true},
  controllerAccount: {type: String},
  payout: {type: String},
  accumulatedStake: {type: Number},//PHA
  workerStake: {type: Number},//PHA
  userStake: {type: Number},//PHA
  stakeAccountNum:{type: Number},
  commission: {type: Number},
  taskScore: {type: Number},
  machineScore: {type: Number},
  onlineReward:{type: Number},
  computeReward: {type: Number},
  reward: {type: Number},
  apy: {type: Number},
  penalty: {type: Number},  
});

export const HistoryRoundInfo = mongoose.model('history_round_info', {
  round: { type: Number },
  avgStake: { type: Number }, //PHA
  avgReward: { type: Number },//PHA
  accumulatedFire2: { type: Number },//PHA
  apyCurrentRound: {type: Number},
  onlineWorkerNum: {type: Number}, 
  workerNum: {type: Number},
  stakeSum: {type: Number},//PHA
  stakeSupplyRate: {type: Number},
  blocktime: {type: Date},
  blockNum: {type: Number},
  workers: {type: [Worker]},
});
HistoryRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
