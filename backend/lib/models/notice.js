import mongoose from  "../../db/mogoose.js"
//db.notices.insertOne({ 'message': 'this is a notice!' });
export const Notice = mongoose.model('notice', {
    message: String,
});
