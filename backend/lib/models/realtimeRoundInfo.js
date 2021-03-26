import mongoose from  "../../db/mogoose.js"

export const Worker = new mongoose.Schema({ 
  stash_account: {type: String, index: true},
  controller_account: {type: String},
  payout: {type: String},
  online_status: {type: Boolean},
  accumulated_stake: {type: Number},//PHA
  worker_stake: {type: Number},//PHA
  user_stake: {type: Number},//PHA
  stake_account_num:{type: Number},
  commission: {type: Number},
  task_score: {type: Number},
  machine_score: {type: Number},
  online_reward:{type: Number},
  compute_reward: {type: Number},
  reward: {type: Number},
  apy: {type: Number},
  penalty: {type: Number}, 
  profit_last_month: {type: Number},
});

export const RealtimeRoundInfo = mongoose.model('realtime_round_info', {
  round: { type: Number },
  avg_stake: { type: Number }, //PHA
  avg_reward: { type: Number },//PHA
  accumulated_fire2: { type: Number },//PHA
  apy: {type: Number},
  round_cycle_time: {type: Number}, //seconds
  online_worker_num: {type: Number}, 
  worker_num: {type: Number},
  stake_sum: {type: Number},//PHA
  stake_supply_rate: {type: Number},
  reward_last_round: {type: Number},
  blocktime: {type: Date},
  workers: {type: [Worker]},
});
RealtimeRoundInfo.collection.createIndex({ round: 1 }, { unique: true })
