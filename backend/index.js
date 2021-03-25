import { createLogger } from 'bunyan'
import Koa from 'koa'
import { node }  from './config/index.js'
import protobuf from './protobuf/protobuf.js'
import {getWorkers} from './api/workers.js'
import {getGlobalStatistics} from './api/globalStatistics.js'
import {getApy} from './api/apy.js'
import {getCommission} from './api/commission.js'
import {getAvgStake, getStakeinfo} from './api/stake.js'
import {getAvgReward, getRewardPenalty} from './api/rewardpenalty.js'

globalThis.$logger = createLogger({
  level: 'info',
  name: 'dashboard'
})

const app = new Koa()

app.on('error', (err, ctx) => {
  $logger.error(err, ctx)
})

const dispatchTable = {
  'workerRequest'               : function(obj) {  const buffer = getWorkers(obj.workerRequest);  return buffer},
  'globalStatisticsRequest'     : function(obj) {  const buffer = getGlobalStatistics();  return buffer },
  'avgStakeRequest'             : function(obj) {  const buffer = getAvgStake();  return buffer},
  'stakeInfoRequest'            : function(obj) {  const buffer = getStakeinfo(obj.stakeInfoRequest); return buffer},
  'avgRewardRequest'            : function(obj) {  const buffer = getAvgReward(); return buffer},
  'rewardPenaltyRequest'        : function(obj) {  const buffer = getRewardPenalty(obj.rewardPenaltyRequest); return buffer},
  'apyRequest'                  : function(obj) {  const buffer = getApy(obj.apyRequest); return buffer},
  'commissionRequest'           : function(obj) {  const buffer = getCommission(obj.commissionRequest); return buffer},
};

// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      var buffers = [];
      // 监听data事件，接受传入的buffer数据，放入buffers数组中
      ctx.req.addListener('data', function(chunk) {
          buffers.push(chunk);
      });
      // 监听end事件
      ctx.req.addListener('end', function(error) {
          if (error) {
              console.log("error:", error)
          } else {
              let resultBuff = Buffer.concat(buffers) // 合并接收到的buffer数据
              var result = protobuf.CommonRequest.decode(resultBuff); // 解码接受到的 buffer 数据
              var obj = protobuf.CommonRequest.toObject(result)  // 转换成json对象
              
              const firstProperity = Object.keys(obj)[0]
              if (firstProperity) {
                if (dispatchTable[firstProperity]) {
                  resolve( dispatchTable[firstProperity](obj) );
                } else {
                  const message = protobuf.CommonResponse.create({status: {msg: "unknow request", success: -1}});
                  const buffer = protobuf.CommonResponse.encode(message).finish();
      
                  return resolve( buffer )
                }
              }
          }
      });
    } catch ( err ) {
      reject(err)
    }
  })
}

// routes
// 接受 post 请求处理
app.use(async ctx => {
  if ( ctx.url === '/' && ctx.method === 'POST' ) {
    // 当POST请求的时候，解析POST表单里的数据，并显示出来
    let postData = await parsePostData( ctx )
    ctx.body = postData
    ctx.set('content-type', 'application/octet-stream');  
    ctx.status = 200;          
  }
});

$logger.info(`Listening on port ${node.HTTP_PORT}...`)
app.listen(node.HTTP_PORT)