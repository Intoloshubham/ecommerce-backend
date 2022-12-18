import express from "express";
import DesignationController from "../controllers/DesignationController.js";
const router = express.Router();

import {
  TeamController,
  UserController,
  AdminController,
  BussinessController,
  ProductKeyController,
  PaymentController,
  AttendanceController
} from "../controllers/index.js";


//attendance
router.get('/attendance/:bussiness_id/:year?/:month?/:user_id?', AttendanceController.index);
router.get('/check-present/:bussiness_id/:user_id', AttendanceController.checkPresent);
router.post('/attendance', AttendanceController.attendance);
router.get('/leaves/:bussiness_id', AttendanceController.getLeaves);
router.post('/apply-leaves', AttendanceController.applyLeaves);
router.put('/approve-leaves/:id', AttendanceController.approveLeaves);



//admin
router.post('/verify-product-key', ProductKeyController.verifyProductKey);
router.post("/user-register", UserController.userRegister);
router.post("/admin-register", AdminController.adminRegister);

//team 
router.post("/team-register", TeamController.teamRegister);
router.put('/team-update/:id',TeamController.updateTeamDetails);
router.post('/team-login',TeamController.loginTeamMember);
router.delete('/delete-team-member/:id', TeamController.destroy);
router.delete('/logout-team-member', TeamController.logout);

//user/client
router.post('/loginUser',UserController.loginUser);
router.post('/logout-user',UserController.logout);
router.post('/register-bussiness',BussinessController.store);

//designation
router.post('/designation',DesignationController.store);
router.get('/designation',DesignationController.index);
router.put('/designation-update/:id',DesignationController.updateDesignation);
router.delete('/designation/:id',DesignationController.destroy);

//payment
router.post('/payment', PaymentController.store);
// router.post('/payment-verify',PaymentController.paymentVerify);

router.post('/bussiness-login', BussinessController.bussinessLogin);
// router.get('/company', [auth, admin], BussinessController.index);
// router.post('/bussiness', BussinessController.store);
router.post('/bussiness-logout', BussinessController.bussinessLogout);



export default router;
