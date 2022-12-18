import mongoose from "mongoose";

const productCategSchema = mongoose.Schema({
    product_category:{ type: String, required:true}
})

export default mongoose.model('ProductCategory',productCategSchema,'productCategory');