import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { User } from "../models/users.models.js";
import {
  updloadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User not found !");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong in generating access or refresh token !"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Register User Logic

  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All the fields are required!!");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(
      401,
      "User with email or username Already Exists",
      existingUser
    );
  }
  const avatarLocalPath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage?.[0]?.path;

  let avatar = "";
  try {
    avatar = await updloadToCloudinary(avatarLocalPath);
    logger.info("Uploaded avatar", avatar);
  } catch (error) {
    logger.error("Error uploading avatar:", error);
    throw new ApiError(401, "Error while uploading avatar");
  }

  let coverImage = "";
  try {
    coverImage = await updloadToCloudinary(coverImageLocalPath);
    logger.info("Uploaded coverImage", coverImage);
  } catch (error) {
    logger("Error Uploading coverImage:", error);
  }

  try {
    const user = await User.create({
      username,
      email,
      fullname,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    logger.info(createdUser);

    if (!createdUser) {
      throw new ApiError(401, "Something went wrong while creating a user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
  } catch (error) {
    logger.error("User creation failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(
      401,
      "Something went wrong while creating a user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // Get data from the body

  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(401, "Email is required");
  }
  if (!username) {
    throw new ApiError(401, "Username is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User not found!");
  }

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(401, "Something Went wrong in user login ");
  }

  const options = {
    httpOnly: true, // Means it cannot be modified from the client side
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in successfully !"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is Required!");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        200,
        { accessToken, newRefreshToken: newRefreshToken },
        "Access Token Refreshed Successfully"
      );
  } catch (error) {
    throw new ApiError(
      401,
      "Something Went wrong in generating a new refresh token "
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully !"));
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User Not Found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Fetched Successfully!"));
});

const updateUserDetails = asyncHandler(async (req, res) => {});
const updateAvatar = asyncHandler(async (req, res) => {});
const updateCoverImage = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUser,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
};
