import Koa from 'koa'
import { node } from './config/index.js'
import protobuf from './lib/protobuf/protobuf.js'
import { getWorkers } from './lib/api/workers.js'
import { getGlobalStatistics } from './lib/api/globalStatistics.js'
import { getApy } from './lib/api/apy.js'
import { getCommission } from './lib/api/commission.js'
import { getAvgStake, getStakeinfo } from './lib/api/stake.js'
import { getAvgReward, getRewardPenalty } from './lib/api/rewardpenalty.js'
import { getNotice } from './lib/api/notice.js'
import { logger } from './lib/utils/log.js'

const app = new Koa()

app.on('error', (err, ctx) => {
    logger.error(err, ctx)
})

const dispatchTable = {
    workerRequest: function (obj) { const buffer = getWorkers(obj.workerRequest); return buffer },
    globalStatisticsRequest: function (obj) { const buffer = getGlobalStatistics(); return buffer },
    avgStakeRequest: function (obj) { const buffer = getAvgStake(); return buffer },
    stakeInfoRequest: function (obj) { const buffer = getStakeinfo(obj.stakeInfoRequest); return buffer },
    avgRewardRequest: function (obj) { const buffer = getAvgReward(); return buffer },
    rewardPenaltyRequest: function (obj) { const buffer = getRewardPenalty(obj.rewardPenaltyRequest); return buffer },
    apyRequest: function (obj) { const buffer = getApy(obj.apyRequest); return buffer },
    commissionRequest: function (obj) { const buffer = getCommission(obj.commissionRequest); return buffer },
    noticeRequest: function (obj) { const buffer = getNotice(); return buffer }
}

function getUnknownRequestBuffer() {
    const message = protobuf.CommonResponse.create({ status: { msg: 'unknow request', success: -1 } })
    const buffer = protobuf.CommonResponse.encode(message).finish()
    return buffer
}

// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            const buffers = []
            // 监听data事件，接受传入的buffer数据，放入buffers数组中
            ctx.req.addListener('data', function (chunk) {
                buffers.push(chunk)
            })
            // 监听end事件
            ctx.req.addListener('end', function (error) {
                if (error) {
                    logger.info('error:', error)
                } else {
                    const resultBuff = Buffer.concat(buffers) // 合并接收到的buffer数据
                    const result = protobuf.CommonRequest.decode(resultBuff) // 解码接受到的 buffer 数据
                    const obj = protobuf.CommonRequest.toObject(result) // 转换成json对象

                    const firstProperty = Object.keys(obj)[0]
                    if (firstProperty) {
                        if (dispatchTable[firstProperty]) {
                            resolve(dispatchTable[firstProperty](obj))
                        } else {
                            resolve(getUnknownRequestBuffer())
                        }
                    } else {
                        resolve(getUnknownRequestBuffer())
                    }
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

// routes
// 接受 post 请求处理
app.use(async ctx => {
    if (ctx.url === '/' && ctx.method === 'POST') {
    // 当POST请求的时候，解析POST表单里的数据，并显示出来
        const postData = await parsePostData(ctx)
        ctx.body = postData
        ctx.set('content-type', 'application/octet-stream')
        ctx.status = 200
    }
})

logger.info(`Listening on port ${node.HTTP_PORT}...`)
app.listen(node.HTTP_PORT)
