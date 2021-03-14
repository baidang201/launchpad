import { db } from "../config/index.js"
import mongoose from "mongoose"

mongoose.connect(db.mongodb)

export default mongoose;