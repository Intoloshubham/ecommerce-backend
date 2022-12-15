import { Admin, User,Team } from "../models/index.js";
import { teamSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const TeamController = {

    async teamRegister(req, res, next){
        const {error} = teamSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const {name, mobile, email} = req.body;
        try {
            const mobile_exist = await Team.exists({mobile:mobile}).collation({ locale:"en", strength:1 });
            if(mobile_exist){
                return next(CustomErrorHandler.alreadyExist('Mobile no already exist'));                
            }

            const email_exist = await Team.exists({email:email}).collation({ locale:"en", strength:1 });
            if(email_exist){
                return next(CustomErrorHandler.alreadyExist('Email already exist'));                
            }
        } catch (err) {
            return next(err);
        }

        const teamData = new Team({
            name,
            mobile,
            email,
        });

        try {
            const result = await teamData.save();
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success('Team created successfully'));
    }

}   

export default TeamController;