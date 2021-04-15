import mongoose from  "../../db/mogoose.js"
//db.notices.insertOne({ 'message': 'this is a notice!', 'publishTime':  ISODate()});
export const Notice = mongoose.model('notice', {
    message: {type: String},
    publishTime: {type: Date},
});
