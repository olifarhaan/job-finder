import { Router } from "express";
import { createRole } from "../controllers/companyController.js";
import { verifyCompany } from "../middlewares/verifyCompanyMiddleware.js";


const router= Router()

router.post('/', verifyCompany , createRole)

export default router