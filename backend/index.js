import { createLogger } from 'bunyan'
import Koa from 'koa'
import { node }  from './config/index.js'
import protobuf from './protobuf/protobuf.js'
import {getWorkers} from './api/workers.js'
import {getGlobalStatistics} from './api/globalStatistics.js'

globalThis.$logger = createLogger({
  level: 'info',
  name: 'dashboard'
})

const app = new Koa()

app.on('error', (err, ctx) => {
  $logger.error(err, ctx)
})

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
              if (obj.workerRequest) {
                let buffer = getWorkers(obj.workerRequest);
                resolve( buffer )
              } else if (obj.globalStatisticsRequest) {                
                let buffer = getGlobalStatistics();
    
                resolve( buffer )
              } else if (obj.stakesRequest) {
                let message = protobuf.CommonResponse.create({status: {success: 0}});
                let buffer = protobuf.CommonResponse.encode(message).finish();
    
                resolve( buffer )
              } else {            
                let message = protobuf.CommonResponse.create({status: {msg: "unknow request", success: -1}});
                let buffer = protobuf.CommonResponse.encode(message).finish();
    
                resolve( buffer )
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