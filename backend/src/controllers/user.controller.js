import { asyncHandler } from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import apiError from "../utils/apiError.js"; // Assuming you have a utility for API responses
import apiResponse from "../utils/apiResponse.js"; // Assuming you have a utility for API responses
import { loginSchema, registerSchema } from "../validator/vaidation.js"; // Assuming you have validation schemas
import { uploadFile } from "../helpers/cloudinary.js"; // Assuming you have a Cloudinary utility
// import userToken from "../utils/userToken.js"; // Assuming you have a utility for generating tokens
import jwt from "jsonwebtoken";

const userToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

export const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, phone } =
      await registerSchema.parseAsync(req.body);
    if (!username || !email || !password || !phone) {
      return apiError(
        res,
        400,
        "Missing required fields",
        "Please provide all required fields"
      );
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return apiError(
        res,
        400,
        "User already exists",
        "User with this email or username already exists"
      );
    }

    const pictureFile = req.file;
    if (!pictureFile) {
      return apiError(
        res,
        400,
        "Missing required fields",
        "Please provide a profile picture"
      );
    }

    const profilePic = await uploadFile(pictureFile);
    if (!profilePic) {
      return apiError(
        res,
        500,
        "Internal server error",
        "Failed to upload profile picture"
      );
    }

    const newUser = new User({
      username: username.toLowerCase(),
      email,
      password,
      profilePic: profilePic.url || "",
      phone,
    });

    await newUser.save();

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    return apiResponse(res, 201, "User created successfully", createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return apiError(
      res,
      500,
      "Internal Server Error",
      "An error occurred while creating the user"
    );
  }
});

export const logInUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = await loginSchema.parseAsync(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return apiError(
        res,
        404,
        "User not found",
        "User with this email does not exist"
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return apiError(res, 401, "Incorrect password", "Password is incorrect");
    }

    const { accessToken, refreshToken } = await userToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        success: true,
        message: "User logged in successfully",
        data: loggedInUser,
      });
  } catch (error) {
    console.log(error);
    return apiError(
      res,
      500,
      "Internal Server Error",
      "An error occurred while logging in the user"
    );
  }
});

export const logOut = asyncHandler(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Error logging out user",
    });
  }
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.refreshToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (refreshToken) {
      apiError(401, "Unauthorised !!!");
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return apiError(401, "Invalid Token !!!");
    }

    if (refreshToken !== user?.refreshToken) {
      return apiError(401, "Invalid Token !!!");
    }

    const { accessToken, refreshToken: newRefreshToken } = await userToken(
      user._id
    );

    res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json({
        success: true,
        message: "User logged in successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
  } catch (error) {
    console.log(error);
    return apiError(
      res,
      500,
      "Internal Server Error",
      "An error occurred while refreshing the access token"
    );
  }
});

export const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return apiError(
        res,
        404,
        "User not found",
        "User with this email does not exist"
      );
    }

    return apiResponse(res, 200, "User found successfully", user);
  } catch (error) {
    apiError(
      res,
      500,
      "Internal Server Error",
      "An error occurred while getting the user"
    );
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const { username, phone } = req.body;

    if (!user) {
      return apiError(
        res,
        404,
        "User not found",
        "User with this email does not exist"
      );
    }

    if (user.username === username || user.phone === phone) {
      return apiError(
        res,
        400,
        "You Can't Provide Same data !!!",
        "User Can't Send Same Data !!!"
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: username,
          phone: phone,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return apiError(
        res,
        400,
        "User not updated",
        "User with this email does not exist"
      );
    }

    return apiResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    return apiError(
      res,
      500,
      "Internal Server Error",
      "An error occurred while updating the user"
    );
  }
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id, {
      new: true,
    });
    if (!user) {
      return apiError(res,500,"User Not Delete !!!", "Not Delete, Something Happened !!!");
    }

    return apiResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    console.log(error);
    return apiError(res,500,"User Not Delete !!!", "Not Delete, Something Happened !!!");
    
  }
});