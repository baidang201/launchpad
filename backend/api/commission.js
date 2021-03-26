import protobuf from '../protobuf/protobuf.js'
import {HistoryRoundInfo} from '../models/historyRoundInfo.js'
import {padArrayStart} from '../utils/index.js'

export async function getCommission(commissionRequest) {
  const historyRoundInfo = await HistoryRoundInfo
    .find( {'workers.stashAccount':  commissionRequest.stashAccount})
    .select({round:1, 'workers.commission.$': 1})
    .sort({round: -1})
    .limit(30*24).lean();//30 days

  if (!historyRoundInfo) {
    const message = protobuf.CommissionResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.CommissionResponse.encode(message).finish();
    return buffer;
  }

  const filterWorkers = historyRoundInfo.map(roundInfo => roundInfo.workers)
    .filter((element, index) => {return 0 == index % 4} )
    .flat(1)

  const commissions = filterWorkers.map(x => x.commission).reverse();

  const rt = { status: { success: 0 } , result: {
    commission: padArrayStart(commissions, 180, 0)
  }};

  const message = protobuf.CommissionResponse.create(rt);
  const buffer = protobuf.CommissionResponse.encode(message).finish();
  return buffer;
}