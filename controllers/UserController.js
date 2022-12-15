import { User, RefreshToken } from "../models/index.js";
import { userSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import CustomFunction from "../services/CustomFunction.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import JwtService from "../services/JwtService.js";
import transporter from "../config/emailConfig.js";
import { EMAIL_FROM, REFRESH_SECRET } from "../config/index.js";

const UserController = {
  async userRegister(req, res, next) { 

    const { error } = userSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, mobile, email } = req.body;

    try {
      const mobile_exist = await User.exists({ mobile: mobile }).collation({
        locale: "en",
        strength: 1,
      });

      if (mobile_exist) {
        return next(CustomErrorHandler.alreadyExist("Mobile no already exist"));
      }

      const email_exist = await User.exists({ email: email }).collation({
        locale: "en",
        strength: 1,
      });

      if (email_exist) {
        return next(CustomErrorHandler.alreadyExist("Email already exist"));
      }
    } catch (err) {
      return next(err);
    }

    const password = CustomFunction.stringPassword(6);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      mobile,
      email,
      password: hashedPassword
    });

    try {
      const result = await userData.save();

      let info = transporter.sendMail({
        from: EMAIL_FROM, // sender address
        to: email, // list of receivers
        subject: "Login password ", // Subject line
        text: " Password  " + password, // plain text body
      });
    } catch (err) {
      return next(err);
    }
    return res.send(CustomSuccessHandler.success("User created successfully"));
  },

  async loginUser(req, res, next) {

    const loginschema = Joi.object({
      mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      password: Joi.string().required(),
    });

    const { error } = loginschema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { mobile, password } = req.body;

    try {
      const data = await User.findOne({ mobile: mobile });
      if (!data) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(password, data.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //generate token
      const access_token = JwtService.sign({ _id: data._id });

      const refresh_token = JwtService.sign(
        { _id: data._id },
        "1y",
        REFRESH_SECRET
      );

      await RefreshToken.create({ token: refresh_token });

      res.json({
        status: 200,
        access_token,
        refresh_token,
        _id: data._id,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
      });
      
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    const refreshScema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = await refreshScema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { refresh_token } = req.body;
    try {
      await RefreshToken.deleteOne({ token: refresh_token });
     

    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }
    return res.send({ status: 200 });
  },
};

export default UserController;
