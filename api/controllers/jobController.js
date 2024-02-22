// controllers/jobController.js
import Company from '../models/companyModel.js';
import User from '../models/userModel.js';
import JobApplication from '../models/jobApplicationModel.js';
import { errorHandler, jsonResponse } from '../utils/errors.js';
import { sendMail } from '../utils/sendMail.js';

export const applyForJob = async (req, res, next) => {
  try {
    const { userId, companyId, role } = req.body;

    if (!userId || !companyId || !role) {
      return next(errorHandler(400, 'All fields are required'));
    }

    const student = await User.findById(userId);
    const company = await Company.findById(companyId);

    if (!student || student.userType !== 'student') {
      return next(errorHandler(400, 'Invalid student account'));
    }

    if (!company) {
      return next(errorHandler(404, 'Company not found'));
    }

    const jobRole = company.roles.find((job) => job.roleName === role);

    if (!jobRole) {
      return next(errorHandler(404, 'Job role not found'));
    }

    const requiredRupees = jobRole.requiredRupees; // Use requiredRupees from the Role schema

    if (student.rupees < requiredRupees) {
      return next(errorHandler(400, 'Insufficient balance to apply for the job'));
    }

    const jobApplication = new JobApplication({
      student: userId,
      role: jobRole._id, // Store the role ID instead of the role name
    });

    await jobApplication.save();

    // Deduct rupees from student's account
    student.rupees -= requiredRupees;
    await student.save();

    // Credit half of the rupees to the company's account
    company.rupees += Math.floor(requiredRupees / 2);
    await company.save();

    // Send email notification to the company
    const emailContent = `${student.name} applied for the role "${role}"`;
    await sendMail(company.user.email, 'New Job Application', emailContent);

    res.status(201).jsonResponse(true, 201, 'Job application successful', jobApplication);
  } catch (error) {
    next(error);
  }
};


export const getStudentHistory = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.userType !== 'student') {
      return next(errorHandler(400, 'Invalid student account'));
    }

    const jobApplications = await JobApplication.find({ student: studentId });

    res.status(200).jsonResponse(true, 200, 'Student job application history', jobApplications);
  } catch (error) {
    next(error);
  }
};

export const getCompanyHistory = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      return next(errorHandler(404, 'Company not found'));
    }

    const jobApplications = await JobApplication.find({ company: companyId });

    res.status(200).jsonResponse(true, 200, 'Company job application history', jobApplications);
  } catch (error) {
    next(error);
  }
};
