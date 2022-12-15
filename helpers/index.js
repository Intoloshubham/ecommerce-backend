import { ObjectId } from "mongodb";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import {WaterLevel} from "../models/index.js";

export default{

    async getWaterLevelId(unique_id){
        const exist = await WaterLevel.exists({ unique_id: unique_id });
        let water_level_id;
        if (!exist) {
            const water = new WaterLevel({
                unique_id: unique_id,
            });
            const result = await water.save();
            water_level_id = result._id;
        } else {
            water_level_id = exist._id;
        }
        return water_level_id;
    }

}

