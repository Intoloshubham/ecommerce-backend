import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized())
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const { _id } = await JwtService.verify(token);
        //here
        const user = {
            _id
        }
        req.user = user;

        //or

        // req.user = {};
        // req.user._id = _id;
        // req.user.role = role;

        next();

    } catch (err) {
        return next(CustomErrorHandler.unAuthorized())
    }


}


export default auth;