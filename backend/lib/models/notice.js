import mongoose from  "../../db/mogoose.js"
//db.notices.insertOne({ 'message': 'this is a notice!', 'publish_time':  ISODate()});
export const Notice = mongoose.model('notice', {
    message: {type: String},
    publish_time: {type: Date},
});
