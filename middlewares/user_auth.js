import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";
import { JWT_SECRET } from "../config/index.js";

const userAuth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized())
    }

    try {
        const token = authHeader.split(' ')[1];
        if (token !== 'undefined') {
            const { _id } = JwtService.verify(token, JWT_SECRET);
            const user = {
                _id
            }
            req.user = user;
            next()
        }

    } catch (err) {
        return next(CustomErrorHandler.unAuthorized())
    }

}


export default userAuth;