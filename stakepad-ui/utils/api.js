import protobuf from './protobuf.js'
import fetch from 'node-fetch';
import {logger} from './log.js'

const URL = 'http://127.0.0.1:3000'
export async function probufFetcher (url, data, resMessage) {
  if (!data) {
    return
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: data
  })
  const buffer = await response.arrayBuffer()
  const msg = resMessage.decode(new Uint8Array(buffer))
  const ret = resMessage.toObject(msg)

  return ret
}

export async function getWorkers(
    page,
    page_size,
    filter_runing,
    filter_stake_enough,
    filter_commission_less_then,
    sort_field_name,
    filter_stash_accounts //array
  ) {
  const message = protobuf.CommonRequest.create({worker_request: 
    {
      page: page, 
      page_size: page_size, 
      filter_runing: filter_runing, 
      filter_stake_enough: filter_stake_enough, 
      filter_commission_less_then: filter_commission_less_then, 
      sort_field_name: sort_field_name,
      filter_stash_accounts: filter_stash_accounts}});
  const buffer = protobuf.CommonRequest.encode(message).finish();
  probufFetcher(URL, buffer, protobuf.WorkerResponse);
}

export async function getGlobalStatistics() {
  const message = protobuf.CommonRequest.create({global_statistics_request: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.GlobalStatisticsResponse)
}

export async function getAvgStakeHistory() {
  const message = protobuf.CommonRequest.create({avg_stake_request: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.AvgStakeResponse)
}

export async function getWorkerStakeHistory(stash_account) {
  const message = protobuf.CommonRequest.create({stake_info_request: {stash_account: stash_account}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.StakeInfoResponse)
}

export async function getAvgRewardHistory() {
  const message = protobuf.CommonRequest.create({avg_reward_request: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.AvgStakeResponse)
}

export async function getWorkerRewardHistory(stash_account) {
  const message = protobuf.CommonRequest.create({reward_penalty_request: {stash_account: stash_account}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.RewardPenaltyResponse)
}

export async function getApyHistory(stash_account) {
  const message = protobuf.CommonRequest.create({apy_request: {stash_account: stash_account}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.ApyResponse)
}

export async function getCommissionHistory(stash_account) {
  const message = protobuf.CommonRequest.create({commission_request: {stash_account: stash_account}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return probufFetcher(URL, buffer, protobuf.CommissionResponse)
}