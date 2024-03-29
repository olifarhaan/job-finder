import Company from "../models/companyModel.js";
import { errorHandler } from "../utils/errors.js";

export const createRole = async (req, res, next) => {
    try {
      const { roleName, minCTC, maxCTC, location } = req.body;
  
      if (!roleName || !minCTC || !maxCTC || !location) {
        return next(errorHandler(400, 'All fields are required'));
      }
      
      const companyId= req.user.id;
      const company = await Company.findOne({user:companyId});
  
      if (!company) {
        return next(errorHandler(404, 'Company not found'));
      }
  
      const existingRole = company.roles.find((role) => role.roleName === roleName);
  
      if (existingRole) {
        return next(errorHandler(400, 'Role with the same name already exists'));
      }
  
      const requiredRupees = roleName.length + String(minCTC).length + String(maxCTC).length + location.length;
  
      if (company.rupees < requiredRupees) {
        return next(errorHandler(400, 'Insufficient balance to create the role'));
      }
  
      const newRole = {
        roleName,
        minCTC,
        maxCTC,
        location,
        requiredRupees,
      };
  
      company.roles.push(newRole);
      await company.save();
  
      // Deduct rupees from company's account
      company.rupees -= requiredRupees;
      await company.save();
  
      res.status(201).jsonResponse(true, 201, 'Role created successfully', newRole);
    } catch (error) {
      next(error);
    }
  };
  