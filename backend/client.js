//npm i node-fetch && node --experimental-json-modules  ./client.js 
import protobuf from './protobuf/protobuf.js'
import fetch from 'node-fetch';


function jsFetch(postBuffer, resMessage) {
  console.log("##postBuffer", postBuffer);
  fetch("http://127.0.0.1:3000", {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-protobuf"
      },
      body: postBuffer
    }).then(res => res.arrayBuffer())
    .catch(error => console.log('Error:', error))
    .then(response => {
　　　 console.log('response',response)
      var msg = protobuf.CommonResponse.decode(new Uint8Array(response))
      var resObj = protobuf.CommonResponse.toObject(msg)
      console.log('resObj', resObj)
    }, err => {
      console.log('err', err)
    })
}

let message = protobuf.CommonRequest.create({globalStatisticsRequest: {}});
console.log(`message = ${JSON.stringify(message)}`);
let buffer = protobuf.CommonRequest.encode(message).finish();
console.log(buffer);
jsFetch(buffer);

let message2 = protobuf.CommonRequest.create({stakesRequest: {}});
console.log(`message = ${JSON.stringify(message2)}`);
let buffer2 = protobuf.CommonRequest.encode(message2).finish();
console.log(buffer2);
jsFetch(buffer2);

let message4 = protobuf.CommonRequest.create({workerRequest: {page: 1, pageSize: 10, filterRuning: false, filterStakeEnough: false, filterCommissionLessThen: false}});
console.log(`message = ${JSON.stringify(message4)}`);
let buffer4 = protobuf.CommonRequest.encode(message4).finish();
jsFetch(buffer4);

let message3 = protobuf.CommonRequest.create({stakeInfoRequest: {stashAccount: "xxxxxxxx"}});
console.log(`message = ${JSON.stringify(message3)}`);
let buffer3 = protobuf.CommonRequest.encode(message3).finish();
jsFetch(buffer3);

