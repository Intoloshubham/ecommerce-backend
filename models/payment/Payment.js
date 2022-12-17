import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";
const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const paymentSchema = mongoose.Schema({
    bussiness_id: { type: ObjectId, required:true, unique:true },
    transaction_id: { type:String, default:"I99N99T99O99L99O99" },
    payment: { type:Number, required:true },
    payment_date: { type:String, default:date },
    payment_time: { type:String, default:time },
    payment_status: { type:Boolean, default:false },
    payment_verify_date: { type:String, default:null },
    payment_verify_time: { type:String, default:null },
    payment_verify: { type:Boolean, default:false },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema, 'payments');