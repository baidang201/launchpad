import mongoose from  "../../db/mogoose.js"
export const Status = mongoose.model('status', {
    headBlockNumber: Number,
    time: Date,
    headBlockId: String,

    lastScanQueueNumber: Number,//最后扫描的轮数，包含
    lastScanNumber: Number,//最后扫描的区块，包含
    lastScanRound: Number,//最后扫描的轮数，包含
    lastScanTime: Date,//最后扫描的区块时间
});
