import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUser,
  logInUser,
  logOut,
  refreshAccessToken,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { adminCheck, verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

// Auth Routes

userRouter.route("/register").post(upload.single("profilePic"), createUser);

userRouter.route("/login").post(logInUser);

userRouter.route("/logout").post(verifyJWT, logOut);

userRouter.route("/refreshToken").post(refreshAccessToken);

// User Routes
userRouter.route("/").get(verifyJWT, getUser);
userRouter.route("/allUser").get(verifyJWT,adminCheck,getAllUser);

// update User
userRouter.route("/update").put(verifyJWT, updateUser);

// delete User If Admin
userRouter.route("/delete/:id").delete(verifyJWT, adminCheck, deleteUser);
export default userRouter;
