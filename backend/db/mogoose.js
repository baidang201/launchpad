import { db } from '../config/index.js'
import mongoose from 'mongoose'

mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(db.mongodb, { useNewUrlParser: true })

export default mongoose
