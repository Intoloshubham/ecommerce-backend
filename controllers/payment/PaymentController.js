import { Bussiness, Payment } from "../../models/index.js";
import { paymentSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();
const PaymentController = {

    // async index(req, res, next){
        
    // },

    async store(req, res, next){
        const {error} = paymentSchema.validate(req.body);

        if (error) {
            return next(error)
        }
        const {bussiness_id, payment} = req.body;

        try {
            const exist = await Payment.exists( { bussiness_id:bussiness_id, payment_status:true } ).collation({ locale: 'en', strength: 1 })
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('Your payment is already done'));
            }
        } catch (err) {
            return next(err);
        }

        const pay = new Payment({
            bussiness_id,
            payment,
            payment_date:date,
            payment_time:time,
            payment_status:true
        });

        try {
            const result = await pay.save();       
            if (result.payment_status==true) {
                const pay_verify = await Payment.findByIdAndUpdate(
                    {_id:result._id},
                    {
                        payment_verify_date:date,
                        payment_verify_time:time,
                        payment_verify:true
                    },
                    {new:true}
                );
                if (pay_verify) {
                    await Bussiness.findByIdAndUpdate(
                        {_id:bussiness_id},
                        {
                            bussiness_verify:true
                        },
                        {new:true}
                    );
                }                
            }
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Payment success'));
    },
    
    // async paymentVerify(req, res, next){

    //     const { id, bussiness_id } = req.body;

    //     try {
    //         const exist = await Payment.exists({_id:id}).select('payment_verify');
    //         if (!exist) {
    //             return next(CustomErrorHandler.notExist('Not exist'));
    //         }
    //         if (exist.payment_verify === true) {
    //             return next(CustomErrorHandler.alreadyExist('Payment is already verified'));
    //         }

    //     } catch (err) {
    //         return next(err);
    //     }
    //     try {
    //         const pay_verify = await Payment.findByIdAndUpdate(
    //             {_id:id},
    //             {
    //                 payment_verify_date:date,
    //                 payment_verify_time:time,
    //                 payment_verify:true
    //             },
    //             {new:true}
    //         );
    //         if (pay_verify) {
    //             await Bussiness.findByIdAndUpdate(
    //                 {_id:bussiness_id},
    //                 {
    //                     bussiness_verify:true
    //                 },
    //                 {new:true}
    //             );
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }
    //     res.send(CustomSuccessHandler.success('Payment verified su ccessfully'));
    // }
    

}

export default PaymentController;