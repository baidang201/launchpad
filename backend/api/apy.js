import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart} from '../utils/index.js'

export async function getApy(apyRequest) {
  const historyRoundInfo = await HistoryRoundInfo.find({}).sort({round: -1}).limit(30*24);//30 days
  if (!historyRoundInfo) {
    const message = protobuf.ApyResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.ApyResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkersRule = x => x.stashAccount === apyRequest.stashAccount;
  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .filter((element, index) => {return 0 == index % 4} )
    .flat(1)
    .filter(filterWorkersRule)

  const apys = filterWorkers.map(x => x.apy).reverse();

  const rt = { status: { success: 0 } , result: {
    apy: padArrayStart(apys, 180, 0)
  }};

  const message = protobuf.ApyResponse.create(rt);
  const buffer = protobuf.ApyResponse.encode(message).finish();
  return buffer;
}