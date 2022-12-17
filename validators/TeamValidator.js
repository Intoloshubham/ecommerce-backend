import Joi from "joi";

const teamSchema = Joi.object().keys({
    bussiness_id:Joi.string().required().error(new Error(`Bussiness id required`)),
    name: Joi.string().required().error(new Error( `"Name" is required cant be an empty`)),
    mobile: Joi.string().required().error(new Error( `"Mobile" is required cant be an empty`)),
    email: Joi.string().required().error(new Error( `"Email" is required cant be an empty`)),
});

export default teamSchema;