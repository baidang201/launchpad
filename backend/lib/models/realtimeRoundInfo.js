import mongoose from  "../../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stashAccount: {type: String, index: true},
  controllerAccount: {type: String},
  payout: {type: String},
  onlineStatus: {type: Boolean},
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
  profitLastMonth: {type: Number},
});

export const RealtimeRoundInfo = mongoose.model('realtime_round_info', {
  round: { type: Number },
  avgStake: { type: Number }, //PHA
  avgReward: { type: Number },//PHA
  accumulatedFire2: { type: Number },//PHA
  apy: {type: Number},
  cycleTime: {type: Number}, //seconds
  onlineWorkerNum: {type: Number}, 
  workerNum: {type: Number},
  stakeSum: {type: Number},//PHA
  stakeSupplyRate: {type: Number},
  rewardLastRound: {type: Number},
  startedAt: {type: Date},
  workers: {type: [Worker]},
});
RealtimeRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
