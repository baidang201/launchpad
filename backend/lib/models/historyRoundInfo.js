import mongoose from  "../../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stash_account: {type: String, index: true},
  controller_account: {type: String},
  payout: {type: String},
  accumulated_stake: {type: Number},//PHA
  worker_stake: {type: Number},//PHA
  user_stake: {type: Number},//PHA
  stake_account_num:{type: Number},
  commission: {type: Number},
  taskScore: {type: Number},
  machine_score: {type: Number},
  online_reward:{type: Number},
  compute_reward: {type: Number},
  reward: {type: Number},
  apy: {type: Number},
  penalty: {type: Number},  
});

export const HistoryRoundInfo = mongoose.model('history_round_info', {
  round: { type: Number },
  avg_stake: { type: Number }, //PHA
  avg_reward: { type: Number },//PHA
  accumulated_fire2: { type: Number },//PHA
  apy_current_round: {type: Number},
  online_worker_num: {type: Number}, 
  worker_num: {type: Number},
  stake_sum: {type: Number},//PHA
  stake_supply_rate: {type: Number},
  blocktime: {type: Date},
  block_num: {type: Number},
  workers: {type: [Worker]},
});
HistoryRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
