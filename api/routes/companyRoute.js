import { Router } from "express";
import { createRole } from "../controllers/companyController";
import { verifyCompany } from "../middlewares/verifyCompanyMiddleware";


const router= Router()

router.post('/', verifyCompany , createRole)

export default router