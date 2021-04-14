
import {Notice} from '../models/notice.js'
import protobuf from '../protobuf/protobuf.js'

export async function getNotice() {
  const notice = await Notice.findOne({}).sort({publish_time: -1}).lean();

  if (!notice) {
    const message = protobuf.NoticeResponse.create({ status: { success: -1, msg: 'can not find data in database' } });
    const buffer = protobuf.NoticeResponse.encode(message).finish();
    return buffer;
  }

  const message = protobuf.NoticeResponse.create({ status: { success: 0 } , result: {notice: notice.message}});
  const buffer = protobuf.NoticeResponse.encode(message).finish();
  return buffer;
}