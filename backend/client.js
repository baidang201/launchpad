//npm i node-fetch && node --experimental-json-modules  ./client.js 
import protobuf from './lib/protobuf/protobuf.js'
import fetch from 'node-fetch';
import {logger} from './lib/utils/log.js'

function jsFetch(postBuffer, resMessage) {
  fetch("http://127.0.0.1:3000", {
      method: 'POST',
      headers: {
        "Content-Type": "application/octet-stream"
      },
      body: postBuffer
    }).then(res => res.arrayBuffer())
    .catch(error => logger.info('Error:', error))
    .then(response => { 
          {
            //WorkerResponse
            logger.info('response',response)
            const msg = resMessage.decode(new Uint8Array(response))
            const resObj = resMessage.toObject(msg)
            logger.info('resObj', resObj)
            logger.info('resObj', JSON.stringify( resObj))
          }  
    }, err => {
      logger.info('err', err)
    })
}

function testworkerRequest() {
  const message4 = protobuf.CommonRequest.create({worker_request: 
    {
      page: 1, 
      page_size: 5, 
      filter_runing: false, 
      filter_stake_enough: false, 
      filter_commission_less_then: true, 
      sort_field_name: 'commission',
      filter_stash_accounts: []}});
  logger.info(`message = ${JSON.stringify(message4)}`);
  const buffer4 = protobuf.CommonRequest.encode(message4).finish();
  jsFetch(buffer4, protobuf.WorkerResponse);
}

function testglobalStatisticsRequest() {
  const message = protobuf.CommonRequest.create({global_statistics_request: {}});
  logger.info(`message = ${JSON.stringify(message)}`);
  const buffer = protobuf.CommonRequest.encode(message).finish();
  logger.info(buffer);
  jsFetch(buffer, protobuf.GlobalStatisticsResponse);
  
}

function teststake() {
  const message2 = protobuf.CommonRequest.create({avg_stake_request: {}});
  logger.info(`message = ${JSON.stringify(message2)}`);
  const buffer2 = protobuf.CommonRequest.encode(message2).finish();
  logger.info(buffer2);
  jsFetch(buffer2, protobuf.AvgStakeResponse);

  const message3 = protobuf.CommonRequest.create({stake_info_request: {stash_account: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}});
  logger.info(`message = ${JSON.stringify(message3)}`);
  const buffer3 = protobuf.CommonRequest.encode(message3).finish();
  jsFetch(buffer3, protobuf.StakeInfoResponse);
}

function testreward() {
  const message5 = protobuf.CommonRequest.create({avg_reward_request: {}});
  logger.info(`message = ${JSON.stringify(message5)}`);
  const buffer5 = protobuf.CommonRequest.encode(message5).finish();
  jsFetch(buffer5, protobuf.AvgRewardResponse);

  const message6 = protobuf.CommonRequest.create({reward_penalty_request: {stash_account: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  logger.info(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.RewardPenaltyResponse);
}


function testapy() {
  const message6 = protobuf.CommonRequest.create({apy_request: {stash_account: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  logger.info(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.ApyResponse);
}

function testcommission() {
  const message6 = protobuf.CommonRequest.create({commission_request: {stash_account: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  logger.info(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.CommissionResponse);
}

function testunknow() {
  const message6 = protobuf.CommonRequest.create({unknow_request: {stash_account: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  logger.info(`message = ${JSON.stringify(message6)}`);
  const buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.CommonResponse);
}

testworkerRequest()

testglobalStatisticsRequest()

teststake()

testreward()

testapy()

testcommission()

testunknow()