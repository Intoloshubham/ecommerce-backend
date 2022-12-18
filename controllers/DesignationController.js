import {
  Admin,
  User,
  Team,
  RefreshToken,
  Designation,
} from "../models/index.js";
import { teamSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import transporter from "../config/emailConfig.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { EMAIL_FROM, REFRESH_SECRET } from "../config/index.js";
import JwtService from "../services/JwtService.js";
import CustomFunction from "../services/CustomFunction.js";
import { ObjectID } from "bson";

const DesignationController = {

  async index(req, res, next) {
    let documents;
    try {
      documents = await Designation.find().select("-createdAt -updatedAt -__v");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async store(req, res, next) {
    try {
        const {designation}=req.body;
      const designation_exist = await Designation.exists({
        designation: designation,
      }).collation({
        locale: "en",
        strength: 1,
      });
      if (designation_exist) {
        return next(
          CustomErrorHandler.alreadyExist("Designation already exist")
        );
      }
    } catch (err) {
      return next(err);
    }
    try {
      const { designation } = req.body;
      const designSchema = new Designation({
        designation,
      });
      const temp = await designSchema.save();
    } catch (error) {
      return next(error);
    }
    return res.send(
      CustomSuccessHandler.success("Designation created successfully")
    );
  },

  async updateDesignation(req, res, next) {
    let document;
    try {
      const { designation } = req.body;

      document = await Designation.findByIdAndUpdate(
        {
          _id: ObjectID(req.params.id),
        },
        {
          designation,
        },
        {
          new: true,
        }
      ).select("-createdAt -updatedAt -__v");
    } catch (error) {
      return next(error);
    }
    res.send({ status: 200, data: document });
  },

  async destroy(req, res, next) {
    const document = await Designation.findByIdAndRemove({
      _id: req.params.id,
    });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },
};

export default DesignationController;
