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
  AttendanceController,
  ProductCategoryController,
  ProductController
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

router.post("/admin-register", AdminController.adminRegister);

//team 
router.post("/team-register", TeamController.teamRegister);
router.put('/team-update/:id',TeamController.updateTeamDetails);
router.post('/team-login',TeamController.loginTeamMember);
router.delete('/team-member/:id', TeamController.destroy);
router.delete('/team-logout', TeamController.logout);

//user or client
router.post('/login-user',UserController.loginUser);
router.delete('/logout-user',UserController.logout);
router.post("/user-register", UserController.userRegister);


//designation
router.post('/designation',DesignationController.store);
router.get('/designation',DesignationController.index);
router.put('/designation-update/:id',DesignationController.updateDesignation);
router.delete('/designation/:id',DesignationController.destroy);

// router.post('/payment-verify',PaymentController.paymentVerify);
router.post('/register-bussiness',BussinessController.store);
router.post('/admin-login', BussinessController.bussinessLogin);
router.delete('/admin-logout', BussinessController.bussinessLogout);



//payment
router.post('/payment', PaymentController.store);

//product category
router.post('/product-category',ProductCategoryController.store);
router.put('/product-category-update/:id',ProductCategoryController.update);
router.delete('/product-category/:id',ProductCategoryController.destroy);
router.get('/product-category',ProductCategoryController.index);

//product 
router.post('/product',ProductController.store);
router.put('/product-update/:id',ProductController.update);
router.delete('/product/:id',ProductController.destroy);
router.get('/product',ProductController.index);



export default router;
