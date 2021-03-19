import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'

export async function getApy() {
  let historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//24 days
  if (!historyRoundInfo) {
    let message = protobuf.ApyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    let buffer = protobuf.ApyResponse.encode(message).finish();
    return buffer;
  }

  const apys = [];

  let rt = { status: { success: 0 } , result: {
    apy: apys
  }};

  let message = protobuf.ApyResponse.create(rt);
  let buffer = protobuf.ApyResponse.encode(message).finish();
  return buffer;
}