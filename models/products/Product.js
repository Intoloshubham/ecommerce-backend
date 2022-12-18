import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    product_categ_id:{type:ObjectId,required:true},
    product_name:{ type: String, required:true},
    product_detail:{ type: String, required:true},
    product_price:{ type: String, required:true},
    product_color:{type:String}
})

export default mongoose.model('Product',productSchema,'product');