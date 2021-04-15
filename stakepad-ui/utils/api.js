import protobuf from './protobuf.js'
import fetch from 'node-fetch';
import {logger} from './log.js'

const URL = process.env.API_ENDPOINT || 'http://127.0.0.1:3000'
export async function fetchProtobuf(url, data, resMessage) {
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
    pageSize,
    filterRuning,
    filterStakeEnough,
    filterCommissionLessThen,
    sortFieldName,
    filterStashAccounts //array
  ) {
  const message = protobuf.CommonRequest.create({workerRequest: 
    {
      page: page, 
      pageSize: pageSize, 
      filterRuning: filterRuning, 
      filterStakeEnough: filterStakeEnough, 
      filterCommissionLessThen: filterCommissionLessThen, 
      sortFieldName: sortFieldName,
      filterStashAccounts: filterStashAccounts}});
  const buffer = protobuf.CommonRequest.encode(message).finish();
  fetchProtobuf(URL, buffer, protobuf.WorkerResponse);
}

export async function getGlobalStatistics() {
  const message = protobuf.CommonRequest.create({globalStatisticsRequest: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.GlobalStatisticsResponse)
}

export async function getAvgStakeHistory() {
  const message = protobuf.CommonRequest.create({avgStakeRequest: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.AvgStakeResponse)
}

export async function getWorkerStakeHistory(stashAccount) {
  const message = protobuf.CommonRequest.create({stakeInfoRequest: {stashAccount: stashAccount}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.StakeInfoResponse)
}

export async function getAvgRewardHistory() {
  const message = protobuf.CommonRequest.create({avgRewardRequest: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.AvgStakeResponse)
}

export async function getWorkerRewardHistory(stashAccount) {
  const message = protobuf.CommonRequest.create({rewardPenaltyRequest: {stashAccount: stashAccount}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.RewardPenaltyResponse)
}

export async function getApyHistory(stashAccount) {
  const message = protobuf.CommonRequest.create({apyRequest: {stashAccount: stashAccount}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.ApyResponse)
}

export async function getCommissionHistory(stashAccount) {
  const message = protobuf.CommonRequest.create({commissionRequest: {stashAccount: stashAccount}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.CommissionResponse)
}

export async function getNotice() {
  const message = protobuf.CommonRequest.create({noticeRequest: {}});
  const buffer = protobuf.CommonRequest.encode(message).finish();

  return fetchProtobuf(URL, buffer, protobuf.NoticeResponse)
}