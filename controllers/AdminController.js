import { Admin, User } from "../models/index.js";
import { adminSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const AdminController = {

    async adminRegister(req, res, next){
        const {error} = adminSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const {name, mobile, email} = req.body;
        try {
            const mobile_exist = await Admin.exists({mobile:mobile}).collation({ locale:"en", strength:1 });
            if(mobile_exist){
                return next(CustomErrorHandler.alreadyExist('Mobile no already exist'));                
            }

            const email_exist = await Admin.exists({email:email}).collation({ locale:"en", strength:1 });
            if(email_exist){
                return next(CustomErrorHandler.alreadyExist('Email already exist'));                
            }
        } catch (err) {
            return next(err);
        }

        const adminData = new Admin({
            name,
            mobile,
            email,
        });

        try {
            const result = await adminData.save();
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('Admin created successfully'));
    }

}   

export default AdminController;