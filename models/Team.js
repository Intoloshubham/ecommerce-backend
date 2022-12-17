import { ObjectID } from "bson";
import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
    bussiness_id:{type:ObjectID,required:true},
    name:{ type: String, required:true},
    mobile:{ type: String, required:true},
    email:{ type: String, required:true},
    designation:{type:String,required:true},
    password: {type:String,required:true}
})

export default mongoose.model('Team',teamSchema,'team');