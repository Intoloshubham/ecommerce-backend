import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";
//import { Company } from "../models/index.js";
import { JWT_SECRET } from "../config/index.js";


const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized())
    }

    try {
        const token = authHeader.split(' ')[1];
        if (token !== 'undefined') {

            const { _id } = JwtService.verify(token, JWT_SECRET);
            // req.company = await Company.findById(_id).select('-password')
            const company = {
                _id
            }
            req.company = company;
            next()
        }

    } catch (err) {
        return next(CustomErrorHandler.unAuthorized())
    }


}


export default auth;