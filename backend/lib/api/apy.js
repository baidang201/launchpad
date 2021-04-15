import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart} from '../utils/index.js'

export async function getApy(apyRequest) {
  const historyRoundInfo = await HistoryRoundInfo
    .find( {'workers.stashAccount':  apyRequest.stashAccount})
    .select({round:1, 'workers.apy.$': 1})
    .sort({round: -1})
    .limit(30*24).lean();//30 days

  if (!historyRoundInfo) {
    const message = protobuf.ApyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.ApyResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .filter((element, index) => {return 0 === index % 4} )
    .flat(1)

  const apys = filterWorkers.map(x => x.apy).reverse();

  const rt = { status: { success: 0 } , result: {
    apy: padArrayStart(apys, 180, 0)
  }};

  const message = protobuf.ApyResponse.create(rt);
  const buffer = protobuf.ApyResponse.encode(message).finish();
  return buffer;
}