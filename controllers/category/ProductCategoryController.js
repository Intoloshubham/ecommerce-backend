import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import transporter from "../../config/emailConfig.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { EMAIL_FROM,REFRESH_SECRET } from "../../config/index.js";
import JwtService from "../../services/JwtService.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectID } from "bson";
import { ProductCategory, RefreshToken } from "../../models/index.js";

const ProductCategoryController = {

  async index(req, res, next) {
    let documents;
    try {
      documents = await ProductCategory.find().select(
        "-createdAt -updatedAt -__v"
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  async store(req, res, next) {
    try {
      const { product_category } = req.body;
      const product_exist = await ProductCategory.exists({
        product_category: product_category,
      }).collation({
        locale: "en",
        strength: 1,
      });
      if (product_exist) {
        return next(CustomErrorHandler.alreadyExist("Product already exist"));
      }
    } catch (err) {
      return next(err);
    }
    try {
      const { product_category } = req.body;
      const productTemp = new ProductCategory({
        product_category,
      });
      const temp = await productTemp.save();
    } catch (error) {
      return next(error);
    }
    return res.send(
      CustomSuccessHandler.success("Product created successfully")
    );
  },

  async update(req, res, next) {
    let document;
    try {
      const { product_category } = req.body;

      document = await ProductCategory.findByIdAndUpdate(
        {
          _id: ObjectID(req.params.id),
        },
        {
          product_category,
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
    const document = await ProductCategory.findByIdAndRemove({
      _id: req.params.id,
    });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },
};

export default ProductCategoryController;
