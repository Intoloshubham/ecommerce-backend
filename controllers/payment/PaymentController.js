import { Payment } from "../../models/index.js";
import { paymentSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

const data = CustomFunction.currentDate();
const time = CustomFunction.currentTime();
const PaymentController = {

    async index(req, res, next){
        
    },

    async store(req, res, next){
        const {error} = paymentSchema.validate(req.body);
        if (error) {
            return next(error)
        }
        const {company_id, payment} = req.body;

        try {
            const exist = await Payment.exists( { company_id:company_id, payment_status:true } ).collation({ locale: 'en', strength: 1 })
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('Your payment is already done'));
            }
        } catch (err) {
            return next(err);
        }

        const pay = new Payment({
            company_id,
            payment,
            payment_date:data,
            payment_time:time,
            payment_status:true
        });
        try {
            const result = await pay.save();
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Payment success'));
    },

}

export default PaymentController;