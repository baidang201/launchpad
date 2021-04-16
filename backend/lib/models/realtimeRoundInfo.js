import mongoose from  "../../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stashAccount: {type: String, index: true},
  controllerAccount: {type: String},
  payout: {type: String},
  onlineStatus: {type: Boolean},
  status: {type: String},
  accumulatedStake: {type: Number, index: true},//PHA
  workerStake: {type: Number},//PHA
  userStake: {type: Number},//PHA
  stakeAccountNum:{type: Number},
  commission: {type: Number, index: true},
  taskScore: {type: Number, index: true},
  machineScore: {type: Number, index: true},
  onlineReward:{type: Number},
  computeReward: {type: Number},
  reward: {type: Number},
  apy: {type: Number, index: true},
  penalty: {type: Number}, 
  profitLastMonth: {type: Number, index: true},
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