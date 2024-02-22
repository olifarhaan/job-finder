// import express from "express"
// import {
//   deleteUserController,
//   getUsersController,
//   updateUserController,
//   getUserController,
// } from "../controllers/userController.js"
// import { verifyUser } from "../middlewares/verifyUserMiddleware.js"
// import { verifyCompany } from "../middlewares/verifyCompanyMiddleware.js"

// const router = express.Router()

// router.get("/", verifyUser, verifyAdmin, getUsersController)
// router.get("/:userId", getUserController)
// router.put("/:userId", verifyUser, updateUserController)
// router.delete("/:userId", verifyUser, deleteUserController)

// export default router

// routes/userRoutes.js
import express from 'express';
const router = express.Router();
// import {registerController, loginController} from '../controllers/userController';

// // Define routes
// router.post('/register', registerController);
// router.post('/login', loginController);

export default router;
