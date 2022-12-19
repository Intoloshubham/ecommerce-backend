import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import transporter from "../../config/emailConfig.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { EMAIL_FROM, REFRESH_SECRET } from "../../config/index.js";
import JwtService from "../../services/JwtService.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectID } from "bson";
import { Product, ProductCategory, RefreshToken } from "../../models/index.js";

const ProductController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await Product.find().select("-createdAt -updatedAt -__v");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  async store(req, res, next) {
    const {
      product_name,
      product_model,
      product_detail,
      product_brand,
      product_dimension,
      product_discount,
      product_material,
      product_qty,
      product_images,
      product_price,
      product_color,
      product_categ_id
    } = req.body;
    try {
      const product_exist = await Product.exists({
        product_categ_id,
        product_model,
        product_name: product_name
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
      //   const { product_name, product_detail, product_price, product_color } = req.body;
      const productTemp = new Product({
        product_categ_id,
        product_name,
        product_model,
        product_detail,
        product_brand,
        product_dimension,
        product_discount,
        product_material,
        product_qty,
        product_images,
        product_price,
        product_color
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
      const {
        product_categ_id,
        product_name,
        product_model,
        product_detail,
        product_brand,
        product_dimension,
        product_discount,
        product_material,
        product_qty,
        product_images,
        product_price,
        product_color
      } = req.body;

      document = await Product.findByIdAndUpdate(
        {
          _id: ObjectID(req.params.id),
        },
        {
          product_categ_id,
          product_name,
          product_model,
          product_detail,
          product_brand,
          product_dimension,
          product_discount,
          product_material,
          product_qty,
          product_images,
          product_price,
          product_color
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
    const document = await Product.findByIdAndRemove({
      _id: req.params.id,
    });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },
};

export default ProductController;
