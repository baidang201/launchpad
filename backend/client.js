//npm i node-fetch && node --experimental-json-modules  ./client.js 
import protobuf from './protobuf/protobuf.js'
import fetch from 'node-fetch';

function jsFetch(postBuffer, resMessage) {
  console.log("##postBuffer", postBuffer);
  fetch("http://127.0.0.1:3000", {
      method: 'POST',
      headers: {
        "Content-Type": "application/octet-stream"
      },
      body: postBuffer
    }).then(res => res.arrayBuffer())
    .catch(error => console.log('Error:', error))
    .then(response => { 
          {
            //WorkerResponse
      　　　 console.log('response',response)
            var msg = resMessage.decode(new Uint8Array(response))
            var resObj = resMessage.toObject(msg)
            console.log('resObj', resObj)
            console.log('resObj', JSON.stringify( resObj))
          }  
    }, err => {
      console.log('err', err)
    })
}

function testworkerRequest() {
  let message4 = protobuf.CommonRequest.create({workerRequest: 
    {
      page: 1, 
      pageSize: 5, 
      filterRuning: false, 
      filterStakeEnough: false, 
      filterCommissionLessThen: true, 
      sortFieldName: 'commission',
      filterStashAccounts: []}});
  console.log(`message = ${JSON.stringify(message4)}`);
  let buffer4 = protobuf.CommonRequest.encode(message4).finish();
  jsFetch(buffer4, protobuf.WorkerResponse);
}

function testglobalStatisticsRequest() {
  let message = protobuf.CommonRequest.create({globalStatisticsRequest: {}});
  console.log(`message = ${JSON.stringify(message)}`);
  let buffer = protobuf.CommonRequest.encode(message).finish();
  console.log(buffer);
  jsFetch(buffer, protobuf.GlobalStatisticsResponse);
  
}

function teststake() {
  let message2 = protobuf.CommonRequest.create({avgStakeRequest: {}});
  console.log(`message = ${JSON.stringify(message2)}`);
  let buffer2 = protobuf.CommonRequest.encode(message2).finish();
  console.log(buffer2);
  jsFetch(buffer2, protobuf.AvgStakeResponse);

  let message3 = protobuf.CommonRequest.create({stakeInfoRequest: {stashAccount: "41rqEQk9YWqVt3RHAyDquCauZJyatUDEDDtMTcNfvYP1MTB6"}});
  console.log(`message = ${JSON.stringify(message3)}`);
  let buffer3 = protobuf.CommonRequest.encode(message3).finish();
  jsFetch(buffer3, protobuf.StakeInfoResponse);
}

function testreward() {
  let message5 = protobuf.CommonRequest.create({avgRewardRequest: {}});
  console.log(`message = ${JSON.stringify(message5)}`);
  let buffer5 = protobuf.CommonRequest.encode(message5).finish();
  jsFetch(buffer5, protobuf.AvgRewardResponse);

  let message6 = protobuf.CommonRequest.create({rewardPenaltyRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  let buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.RewardPenaltyResponse);
}


function testapy() {
  let message6 = protobuf.CommonRequest.create({apyRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  let buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.ApyResponse);
}

function testcommission() {
  let message6 = protobuf.CommonRequest.create({commissionRequest: {stashAccount: "42SrMJERV2P2aDcLbDdUdRNaPGzQZU8hNUuJDgMitUGqFp5q"}});
  console.log(`message = ${JSON.stringify(message6)}`);
  let buffer6 = protobuf.CommonRequest.encode(message6).finish();
  jsFetch(buffer6, protobuf.CommissionResponse);
}

testworkerRequest()

testglobalStatisticsRequest()

teststake()

testreward()

testapy()

testcommission()