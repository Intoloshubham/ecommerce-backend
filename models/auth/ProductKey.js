import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productKeySchema = mongoose.Schema({
    bussiness_id: {type: ObjectId, required:true},
    product_key: {type: String, required:true},
    product_key_verify: {type: Boolean, default:false},
})

export default mongoose.model('ProductKey', productKeySchema, 'productKeys');