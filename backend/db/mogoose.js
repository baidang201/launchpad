import { db } from "../config/index.js"
import mongoose from "mongoose"

mongoose.set('useFindAndModify', false);
mongoose.connect(db.mongodb)

export default mongoose;