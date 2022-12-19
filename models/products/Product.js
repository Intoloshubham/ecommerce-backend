import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  product_categ_id: { type: ObjectId, required: true },
  product_name: { type: String, required: true },
  product_detail: { type: String, required: true },
  product_price: { type: String, required: true },
  product_color: { type: String },
  product_model: { type: String },
  product_brand: { type: String },
  product_dimension: 
    {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    }
  ,
  product_discount: { type: Number },
  product_material: { type: String },
  product_qty: { type: Number },
  product_images: { type: Array }
// product_images: { 
//     data: Buffer, 
//     contentType: String 
//  }
});

export default mongoose.model("Product", productSchema, "product");
