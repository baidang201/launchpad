import mongoose from  "../db/mogoose"

const Worker = new mongoose.Schema({ 
  stashAccount: {tyep: String},
  controllerAccount: {tyep: String},
  payout: {tyep: String},
  accumulatedStake: {type: mongoose.Decimal128},//bigNum?
  workerStake: {tyep: mongoose.Decimal128},//bigNum?
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
  avgStake: { type: Number },
  avgreward: { type: Number },
  accumulatedFire2: { type: Number },
  blocktime: {type: Date},
  workers: {type: [Worker]},
});
RealtimeRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
