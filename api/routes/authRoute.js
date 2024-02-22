import express from "express";
import {
  signupUserController,
  signupCompanyController,
  signinController,
  googleController,
  signoutController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup/company", signupCompanyController);
router.post("/signup/user", signupUserController);
router.post("/signin", signinController);
router.post("/signout", signoutController);

export default router;
