import Joi from "joi";

const paymentSchema = Joi.object().keys({
    bussiness_id: Joi.string().required(),
    payment: Joi.number().required().error(new Error(`"Payment Amount" is required cant be an empty`)), //only single validation msg 
})

export default paymentSchema;