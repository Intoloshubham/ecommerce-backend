import { Attendance } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";
import CustomFunction from "../../services/CustomFunction.js";

const AttendanceController = {

    //show attendance all employee
    async index(req, res, next){
        let documents; 
        let condition;
        try {
            
            if (req.params.user_id) {
                condition = {"bussiness_id": ObjectId(req.params.bussiness_id), "user_id": ObjectId(req.params.user_id)} 
            } else {
                condition = { 
                    "bussiness_id": ObjectId(req.params.bussiness_id),
                }
            }
            documents = await Attendance.aggregate([
                {
                    $match:{
                        $and:[
                            condition,
                            {"year": parseInt(req.params.year)}, 
                            {"month": parseInt(req.params.month)},
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'team',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userData'
                    },
                },
                {
                    $unwind:"$userData"
                },
                {
                    $project:{
                        _id:1,
                        bussiness_id:1,
                        user_id:1,
                        year:1,
                        month:1,
                        user_name:"$userData.name",
                        "presentdates": {$ifNull: ["$presentdates", []]},
                        leavedates:"$leavedates"
                    }
                }         
            ]);
  
            
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status":200, data:documents });
    },

    async checkPresent(req, res, next){
        const { company_id, user_id} = req.params;
        const current_date = CustomFunction.currentDate();

        try {
            const exist = await Attendance.exists({company_id: ObjectId(company_id), user_id: ObjectId(user_id), presentdates: { $elemMatch: { present_date: current_date } }});
            if (exist) {
                return res.send(CustomSuccessHandler.customMessage('You are already presented') );
            }
        } catch (err) {
            return next(err);
        }
        return res.json({ status:200 });
    },

    async getLeaves(req, res, next){
        let documents; 
        try {
            documents = await Attendance.aggregate([
                {
                    $match:{
                        "bussiness_id":ObjectId(req.params.bussiness_id)
                    }
                },
                {$unwind:'$leavedates'},
                {$match:{'leavedates.approved':false}},
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userData'
                    },
                },
                {
                    $unwind:"$userData"
                },
                {
                    $group:{
                        _id:'$_id', 
                        "user_id": { "$first": "$user_id" },
                        "user_name": { "$first": "$userData.name" },
                        leavedates:{$push:'$leavedates'}
                    }
                },
                {
                    $project:{
                        _id:1,
                        user_id:1,
                        user_name:"$user_name",
                        "presentdates": {$ifNull: ["$presentdates", []]},
                        // "leavedates":{
                        //     _id:1,
                        //     leave_date:1,
                        //     approved:1,
                        // }
                        leavedates:"$leavedates"
                    }
                }

            ]);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ status:200, data:documents });
    },

    async attendance(req, res, next){
        const { bussiness_id, user_id} = req.body;
       
        const current_date = CustomFunction.currentDate();
        const current_time = CustomFunction.currentTime();
        const year = CustomFunction.currentYearMonthDay('YYYY');
        const month = CustomFunction.currentYearMonthDay('MM')
        const month_name = CustomFunction.monthName();
        
        let attendance_main_id;
        const exist = await Attendance.exists({user_id: ObjectId(user_id), year:year, month:month});
        try {
            if (!exist) {
                const attendance = new Attendance({
                    bussiness_id:bussiness_id,
                    user_id:user_id,
                    year:year,
                    month:month,
                    month_name:month_name
                });
                const result = await attendance.save();
                attendance_main_id = result._id;
            }else{
                attendance_main_id = exist._id;
            }
        } catch (err) {
            return next(err);
        }

        try {
            
            const exist = await Attendance.exists({_id: attendance_main_id, presentdates: { $elemMatch: { present_date: current_date } }});
            
            if (exist) {
                return res.send(CustomErrorHandler.alreadyExist('You are already presented'));
            }
           
            await Attendance.findByIdAndUpdate(
                {_id: attendance_main_id},
                {
                    $push:{
                        "presentdates": {
                            present_date : current_date,
                            in_time : current_time,
                        }
                    }
                },
                { new: true }
            );
        } catch (error) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success(`Today you are present your in time is ${current_time}`));
    },

    async attendanceOutTime(req, res, next){
        const {user_id} = req;
        try {
            const current_date = CustomFunction.currentDate();
            const current_time = CustomFunction.currentTime();
            const year = CustomFunction.currentYearMonthDay('YYYY');
            const month = CustomFunction.currentYearMonthDay('MM');

            const exist = await Attendance.exists({ user_id: ObjectId(user_id), year:year, month:month });

            if (exist) {
                await Attendance.findOneAndUpdate(
                    {
                        _id: exist._id, "presentdates.present_date": current_date
                    },
                    {
                        $set: 
                        { 
                            "presentdates.$.out_time" : current_time
                        }
                    },
                );
            }
        } catch (err) {
            return ({ status:400});
        }
        return ({ status:200});
    },

    async applyLeaves(req, res, next){

        const { bussiness_id, user_id, leavedates } = req.body;
        
        const year = CustomFunction.currentYearMonthDay('YYYY');
        const month = CustomFunction.currentYearMonthDay('MM');
        const month_name = CustomFunction.monthName();

        let attendance_main_id;

        const exist = await Attendance.exists({bussiness_id:ObjectId(bussiness_id), user_id: ObjectId(user_id), year:year, month:month});
        try {
            if (!exist) {
                const attendance = new Attendance({
                    bussiness_id,
                    user_id,
                    year:year,
                    month:month,
                    month_name:month_name,
                });
                const result = await attendance.save();
                attendance_main_id = result._id;
            }else{
                attendance_main_id = exist._id;
            }
            
        } catch (err) {
            return next(err);
        }

        let leave_date_exist;
        try {
            leavedates.forEach( async (list, key) => {
                leave_date_exist = await Attendance.find({
                    _id: attendance_main_id , 
                    "leavedates.leave_date": list.leave_date
                })
                if (leave_date_exist.length > 0) {
                    return;
                }
                const leaveData = await Attendance.findByIdAndUpdate(
                    {_id: attendance_main_id},
                    {
                        $push:{
                            "leavedates": {
                                leave_date : list.leave_date,
                            }
                        }
                    },
                    { new: true }
                );
            })
        } catch (err) {
            return next(err)
        }

        res.send(CustomSuccessHandler.success('Leave apply successfully'));
    },

    async approveLeaves(req, res, next){
        try {
            const {leavedates}  = req.body;
            leavedates.forEach( async (list, key) => {
                await Attendance.findOneAndUpdate(
                    {
                        _id: req.params.id, "leavedates._id": list.leave_date_id
                    },
                    {
                        $set: 
                        { 
                            "leavedates.$.approved" : true 
                        }
                    },
                );
            })
            res.send(CustomSuccessHandler.success("Leave Approved successfully!"))
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }

}


export default AttendanceController;

