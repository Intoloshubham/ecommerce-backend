import { Company } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import Constants from "../constants/index.js";

const admin = async (req, res, next) =>{
    try {
        const company = await Company.findOne({_id: req.company._id}).select('-password -__v');
        if (company.role == Constants.ADMINISTRATOR) {
            next();
        }else{
            next(CustomErrorHandler.unAuthorized());
        }
    } catch (err) {
        return next(CustomErrorHandler.serverError(err.message));
    }
}

export default admin;