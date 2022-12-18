import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name:{ type: String, required:true},
    mobile:{ type: String, required:true},
    email:{ type: String, required:true},
})

export default mongoose.model('Admin',adminSchema,'admin');