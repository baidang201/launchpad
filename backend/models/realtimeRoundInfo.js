import mongoose from  "../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stashAccount: {type: String},
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
  apyprofit: {type: Number},
  penalty: {type: Number},  
});

export const RealtimeRoundInfo = mongoose.model('realtimeRoundInfo', {
  round: { type: Number },
  avgStake: { type: Number }, //PHA
  avgreward: { type: Number },//PHA
  accumulatedFire2: { type: Number },//PHA
  apy: {type: Number},
  roundCycleTime: {type: Number}, //seconds
  onlineWorkerNum: {type: Number}, 
  workerNum: {type: Number},
  stakeSum: {type: Number},//PHA
  stakeSupplyRate: {type: Number},
  rewardLastRound: {type: Number},
  blocktime: {type: Date},
  workers: {type: [Worker]},
});
RealtimeRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
