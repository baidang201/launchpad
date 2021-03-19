import mongoose from  "../db/mogoose.js"
//get_dynamic_global_properties
export const Status = mongoose.model('status', {
    head_block_number: Number,
    time: Date,
    head_block_id: String,

    last_scan_number: Number,//最后扫描的区块，包含
    last_scan_round: Number,//最后扫描的轮数，包含
    last_scan_time: Date,//最后扫描的区块时间
});
