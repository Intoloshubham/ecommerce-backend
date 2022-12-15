import { WaterSetting, WaterLevel } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import helpers from "../helpers/index.js";

const WaterSettingController = {

    async getWaterSetting(req, res, next){
        let documents;
        try {
            const exist = await WaterLevel.exists({unique_id:req.params.unique_id});
            if (!exist) {
                return next(CustomErrorHandler.notFound('Data not fount'))
            }
            documents = await WaterSetting.findOne({water_level_id:exist._id}).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async setWaterSetting(req, res, next){
        // const water_level_id = await getWaterLevelId(req.params.unique_id);
        const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);

        const { start_level, stop_level, pump_notification } = req.body;
        try {
            if (stop_level <= start_level ) {
                return next(CustomErrorHandler.inValid('Maximum Level is not allow less than Minimum Level'));
            }

            const diff = stop_level - start_level ;
            if (diff < 10 ) {
                return next(CustomErrorHandler.inValid('Difference between minimum and maximum level is 10. Like (minimum is - 10 than maximum is - 20) '));
            }

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        
        try {
            const filter = { water_level_id: water_level_id};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...(start_level && { start_level: start_level}),
                    ...(stop_level && { stop_level: stop_level }),
                }
            };
            const result = await WaterSetting.updateOne(filter, updateDoc, options);
            
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.send(CustomSuccessHandler.success('Water level min and max percentage updated successfully'));
    },

    async setMotorNotificationSetting(req, res, next){
        // const water_level_id = await getWaterLevelId(req.params.unique_id);
        const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
        const { motor_notification } = req.body;
        try {
            const filter = { water_level_id: water_level_id};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    motor_notification
                }
            };
            const result = await WaterSetting.updateOne(filter, updateDoc, options);
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('Motor notification updated successfully'));
    },

    async tankHeightSetting(req, res, next){
        // const water_level_id = await getWaterLevelId(req.params.unique_id);
        const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
        const { tank_height_type, tank_height, tank_height_unit } = req.body;

        try {
            const filter = { water_level_id: water_level_id};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    tank_height_type,
                    tank_height,
                    tank_height_unit,
                }
            };
            const result = await WaterSetting.updateOne(filter, updateDoc, options);
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('Water tank height updated successfully'));
    },

    async waterSourceSetting(req, res, next){
        // const water_level_id = await getWaterLevelId(req.params.unique_id);
        const water_level_id = await helpers.getWaterLevelId(req.params.unique_id);
        const { water_source_1, water_source_2 } = req.body;
        try {
            const filter = { water_level_id: water_level_id};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    water_source_1,
                    water_source_2,
                }
            };
            const result = await WaterSetting.updateOne(filter, updateDoc, options);
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('Water source updated successfully'));
    }
}

// async function getWaterLevelId(unique_id){
//     const exist = await WaterLevel.exists({ unique_id: unique_id });
//     let water_level_id;
//     if (!exist) {
//         const water = new WaterLevel({
//             unique_id: unique_id,
//         });
//         const result = await water.save();
//         water_level_id = result._id;
//     } else {
//         water_level_id = exist._id;
//     }
//     return water_level_id;
// }


export default WaterSettingController;