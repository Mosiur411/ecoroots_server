import catchAsync from '../../utils/catchAsync';
import { sendImageToCloudinary } from '../../utils/cloudinaryImageUploader';
import { httpStatus } from '../../utils/httpStatus';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const result = await userServices.changeUserStatus(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users updated Successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userServices.getMyProfile(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile fetched Successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await userServices.getSingleUserFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User fetched Successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const payload = req.body;
  if (req?.file) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
    const imageName = `${uniqueSuffix}-${req.user?.email.split('@')[0]}`;
    const path = req.file?.buffer;

    const { secure_url } = await sendImageToCloudinary(imageName, path);

    payload.image = secure_url;
  } else {
    const existingUser = await userServices.getSingleUserFromDB(req.user.id);
    if (existingUser) {
      payload.image = existingUser.image;
    }
  }

  const { accessToken, refreshToken } = await userServices.updateProfile(
    req.user.id,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

export const userControllers = {
  createUser,
  changeUserStatus,
  getMyProfile,
  updateProfile,
  getSingleUser,
};
