import mongoose from "mongoose";

const bussinessSchema = mongoose.Schema({
    bussiness_name: {type: String, required:true},
    name: {type:String, required:true },
    mobile: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'Administrator' },
    bussiness_verify: { type: Boolean, default: false },
})

export default mongoose.model('Bussiness', bussinessSchema, 'bussinesses');