import express from "express";
const router = express.Router();

import {
  TeamController,
  UserController,
  AdminController,
} from "../controllers/index.js";
;


router.post("/user-register", UserController.userRegister);
router.post("/admin-register", AdminController.adminRegister);
router.post("/team-register", TeamController.teamRegister);
router.post('/loginUser',UserController.loginUser);


export default router;
