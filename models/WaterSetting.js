import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const waterSettingSchema = mongoose.Schema({
    water_level_id:{ type: ObjectId, required:true, unique:true },
    start_level:{ type: Number, default:0 },
    stop_level:{ type: Number, default:0 },
    motor_notification:{ type: Boolean, default:false },
    tank_height_type: { type:Boolean, default:false },
    tank_height: { type:Number, default:0 },
    tank_height_unit: { type:Number, default:0 },
    water_source_1: { type:Boolean, default:true },
    water_source_2: { type:Boolean, default:false },
});

export default mongoose.model('WaterSetting', waterSettingSchema, 'waterSettings');