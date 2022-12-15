import { User } from "../models/index.js";
import { userSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const UserController = {

    async userRegister(req, res, next){
        const {error} = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const {name, mobile, email} = req.body;
        try {
            const mobile_exist = await User.exists({mobile:mobile}).collation({ locale:"en", strength:1 });
            if(mobile_exist){
                return next(CustomErrorHandler.alreadyExist('Mobile no is already exist'));                
            }

            const email_exist = await User.exists({email:email}).collation({ locale:"en", strength:1 });
            if(email_exist){
                return next(CustomErrorHandler.alreadyExist('Email is already exist'));                
            }
        } catch (err) {
            return next(err);
        }

        const userData = new User({
            name,
            mobile,
            email,
        });

        try {
            const result = await userData.save();
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('User created successfully'));
    }

}   

export default UserController;