import express from "express";
const router = express.Router();

import {
  TeamController,
  UserController,
  AdminController,
  BussinessController,
  ProductKeyController
} from "../controllers/index.js";
;

router.post('/verify-product-key', ProductKeyController.verifyProductKey);
router.post("/user-register", UserController.userRegister);
router.post("/admin-register", AdminController.adminRegister);
router.post("/team-register", TeamController.teamRegister);
router.post('/loginUser',UserController.loginUser);
router.post('/logout-user',UserController.logout);
router.post('/register-bussiness',BussinessController.store);

router.post('/bussiness-login', BussinessController.bussinessLogin);
// router.get('/company', [auth, admin], BussinessController.index);
// router.post('/bussiness', BussinessController.store);
router.post('/bussiness-logout', BussinessController.bussinessLogout);



export default router;
