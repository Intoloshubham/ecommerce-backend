import Joi from "joi";
import {
  Bussiness,
  RefreshToken,
  ProductKey,
  Payment,
} from "../../models/index.js";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";

import transporter from "../../config/emailConfig.js";
import { EMAIL_FROM } from "../../config/index.js";

const BussinessController = {

  async bussinessLogin(req, res, next) {

    const bussinessSchema = Joi.object({
      mobile: Joi.number().required(),
      password: Joi.string().required(),
    });

    const { error } = bussinessSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exist = await Bussiness.exists({ mobile: req.body.mobile });
      if (!exist) {
        return next(
          CustomErrorHandler.notExist(
            'You do not exist, please click on "Free Register & Purchase" button for register a new bussiness.'
          )
        );
      }

      const product_key = await ProductKey.exists({
        bussiness_id: exist._id,
        product_key_verify: false,
      });
      if (product_key) {
        return res.json({
          status: 301,
          bussiness_id: exist._id,
          message: "Product key not verify.",
        });
      }

      const payment_exist = await Payment.exists({bussiness_id: exist._id});
      if(!payment_exist){
          return res.json({ status:302, bussiness_id:exist._id, message:'Payment not exist.' });
      }

      //check admin verify
      const check_payment = await Payment.exists({bussiness_id: exist._id, payment_verify:false});
      if(check_payment){
          return res.json({ status:303, message:'Please wait until your payment is not verified.' });
      }
    } catch (err) {
      return next(err);
    }

    try {
      const bussiness = await Bussiness.findOne({ mobile: req.body.mobile });
      if (!bussiness) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const match = await bcrypt.compare(req.body.password, bussiness.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const access_token = JwtService.sign({ _id: bussiness._id });
      const refresh_token = JwtService.sign(
        { _id: bussiness._id },
        "1y",
        REFRESH_SECRET
      );

      await RefreshToken.create({ token: refresh_token });

      res.json({
        status: 200,
        access_token,
        refresh_token,
        _id: bussiness._id,
        bussiness_name: bussiness.bussiness_name,
        name: bussiness.name,
        mobile: bussiness.mobile,
        email: bussiness.email,
      });
    } catch (err) {
      return next(err);
    }
  },

  async index(req, res, next) {
    let ducument;
    try {
      ducument = await Bussiness.findOne({ _id: req.params._id }).select(
        "-password -role -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(ducument);
  },

  async store(req, res, next) {
    
    const bussinessSchema = Joi.object({
      bussiness_name: Joi.string().required(),
      name: Joi.string().required(),
      mobile: Joi.number().required(),
      email: Joi.string().required(),
      // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });

    const { error } = bussinessSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exist = await Bussiness.exists({ mobile: req.body.mobile });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("Mobile no  already exist")
        );
      }
    } catch (err) {
      return next(err);
    }

    try {
      const exist = await Bussiness.exists({ email: req.body.email });
      if (exist) {
        return next(CustomErrorHandler.alreadyExist("Email already exist"));
      }
    } catch (err) {
      return next(err);
    }
    const password = CustomFunction.stringPassword(6);

    // Hash password

    const { bussiness_name, name, mobile, email } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const bussinessTemp = new Bussiness({
      bussiness_name,
      name,
      mobile,
      email,
      password: hashedPassword
    });

    try {
      const result = await bussinessTemp.save();
      if (result) {
        const product_key = new ProductKey({
          bussiness_id: result._id,
          product_key: password,
        });

        try {
          const product_key_data = await product_key.save();
        } catch (err) {
          return next(err);
        }
      }

      let info = transporter.sendMail({
        from: EMAIL_FROM, // sender address
        to: email, // list of receivers
        subject: "Login Password and Product Key", // Subject line
        text: " Password and product key " + password, // plain text body
      });

      // res.send(CustomSuccessHandler.success('Company created successfully'));

      res.json({
        status: 200,
        _id: result._id,
        bussiness_name: result.bussiness_name,
        name: result.name,
        mobile: result.mobile,
        email: result.email,
        message: "Bussiness created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  async bussinessLogout(req, res, next) {
    // validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

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

// function stringPassword(len){
//     var gen_pass = "";
//     var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//     for( var i=0; i < len; i++ ){
//         gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
//     }
//     return gen_pass;

export default BussinessController;
