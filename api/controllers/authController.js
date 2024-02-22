import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errors.js";
import Company from "../models/companyModel.js";

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv/config";
import { isValidEmail } from "../utils/validEmail.js";
import mongoose from "mongoose";

export const signupController = async (req, res, next) => {
  console.log(req.body);

  const { name, email, userType, password } = req.body;

  // const name = nameParsed.trim()
  // const username = usernameParsed.trim()
  // const email = emailParsed.trim()
  // const password = passwordParsed.trim()

  if (
    !name ||
    !email ||
    !userType ||
    !password ||
    name === "" ||
    email === "" ||
    userType === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (email.includes(" ") || password.includes(" ")) {
    return next(
      errorHandler(
        400,
        "Username, email and password should not contain whitespace"
      )
    );
  }

  if (!isValidEmail(email)) {
    return next(errorHandler(400, "Enter a valid email"));
  }

  try {
    // check for existing user
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(
        errorHandler(409, "Email already registered, sign in instead")
      );
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      userType,
      password: hashedPassword,
    });
    //saving the new user
    const response = await newUser.save();
    res.status(201).jsonResponse(true, 201, "Sign up successfull");
  } catch (error) {
    next(error);
  }
};

export const signinController = async (req, res, next) => {
  try {
    let { email, password, userType } = req.body;

    email = email.trim();
    password = password.trim();
    userType = userType.trim(); // Assuming userType is a string, adjust as needed

    if (!email || !password || !userType || email === '' || password === '' || userType === '') {
      return next(errorHandler(400, 'All fields are required'));
    }

    if (email.includes(' ') || password.includes(' ') || userType.includes(' ')) {
      return next(errorHandler(400, 'Email, password, and userType should not contain whitespace'));
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, 'Enter a valid email'));
    }

    const user = await User.findOne({ email, userType });

    if (!user) {
      return next(errorHandler(404, 'User does not exist'));
    }

    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword) {
      return next(errorHandler(400, 'Invalid credentials'));
    }

    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    });

    const { password: passwordExtracted, ...userWithoutPassword } = user._doc;

    res.status(200).jsonResponse(
      true,
      200,
      'User signed in successfully',
      userWithoutPassword
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};


export const googleController = async (req, res, next) => {
  const { email, name, imgUrl } = req.body;

  if (!isValidEmail(email)) {
    return next(errorHandler(400, "Enter a valid email"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const username = (
        name.split(" ").join("-") +
        "-" +
        Math.random().toString(36).slice(-8)
      ).toLowerCase();
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
        imgUrl,
      });
      newUser.save();
      const auth_token = jwt.sign(
        {
          id: newUser._id,
          role: newUser._doc.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", auth_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      const { password: passwordExtracted, ...userWithoutPassword } =
        newUser._doc;
      res
        .status(200)
        .jsonResponse(true, 200, "Signed in successfully", userWithoutPassword);
    } else {
      const auth_token = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser._doc.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", auth_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      // console.log(existingUser)
      const { password: passwordExtracted, ...userWithoutPassword } =
        existingUser._doc;
      res
        .status(200)
        .jsonResponse(true, 200, "Signed in successfully", userWithoutPassword);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signoutController = async (req, res, next) => {
  try {
    console.log("first");

    res.clearCookie("auth_token");
    console.log("second");

    res.status(200).jsonResponse(true, 200, "User signed out successfully");
  } catch (error) {
    next(error);
  }
};

export const signupUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (email.includes(" ") || password.includes(" ")) {
      return next(
        errorHandler(400, "Email and password should not contain whitespace")
      );
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "Enter a valid email"));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(
        errorHandler(409, "Email already registered, sign in instead")
      );
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType: "student",
      rupees: 200,
    });

    newUser._id = new mongoose.Types.ObjectId();
    const response = await newUser.save();
    res
      .status(201)
      .jsonResponse(true, 201, "User registration successful", response);
  } catch (error) {
    next(error);
  }
};

export const signupCompanyController = async (req, res, next) => {
  try {
    let { name, email, password, companyName, logo } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !companyName ||
      name === "" ||
      email === "" ||
      password === "" ||
      companyName === ""
    ) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (email.includes(" ") || password.includes(" ")) {
      return next(
        errorHandler(400, "Email and password should not contain whitespace")
      );
    }

    if (!isValidEmail(email)) {
      return next(errorHandler(400, "Enter a valid email"));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(
        errorHandler(409, "Email already registered, sign in instead")
      );
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType: "company",
      rupees: 300,
    });

    await user.save();

    if (!logo) {
      logo =
        "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?w=740&t=st=1708610003~exp=1708610603~hmac=76b91103a96bb6b2d98c7e415fcfe38a6ce0a75fb21aeabaf4a4e741d7bfb675";
    }

    const company = new Company({
      user: user._id,
      companyName,
      logo,
      roles: [],
    });

    await company.save();

    res
      .status(201)
      .jsonResponse(true, 201, "Company registration successful", {
        user,
        company,
      });
  } catch (error) {
    next(error);
  }
};
