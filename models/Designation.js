import { ObjectID } from "bson";
import mongoose from "mongoose";

const designSchema = mongoose.Schema({    
    designation:{type:String,required:true}
})

export default mongoose.model('Designation',designSchema,'designations');