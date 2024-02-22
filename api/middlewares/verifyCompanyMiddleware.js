import { errorHandler } from "../utils/errors.js";
import { UNAUTHORIZED_MESSAGE, roles } from "../utils/constants.js";

export const verifyCompany = (req, res, next) => {
  console.log("inside verify company outside--------------------");
  if (req.user.userType==="company") {
    console.log("inside verify company--------------------");
    next();
  } else {
    return next(errorHandler(401, UNAUTHORIZED_MESSAGE));
  }
};


