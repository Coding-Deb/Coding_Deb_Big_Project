import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      //   apiError(401, "Unauthorized request");
      return res.status(400).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken);

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );

    // console.log(user);

    if (!user) {
      //   apiError(401, "Invalid Access Token");
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token",
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Invalid Access Token",
    });
  }
});

export const adminCheck = asyncHandler(async (req, res, next) => {
  try {
    const loggedUser = await User.findById(req.user.id);
    if (loggedUser.admin === true) {
      next();
    } else {
      return apiError(res, 404, "Don't Have Access !!!", "Can't Change !!!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
