/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '../../config';
import prisma from '../../config/prisma';
import AppError from '../../errors/AppError';
import { httpStatus } from '../../utils/httpStatus';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../../utils/jwtHelper';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import { defaultUserImage } from '../../constants/global.constants';

// loginUserIntoDB
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isActive: true,
    },
  });

  const isPassswordCorrect: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPassswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Credentials');
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      image: userData?.image || defaultUserImage,
      name: userData.name,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiration as string
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      image: userData?.image || defaultUserImage,
      name: userData.name,
    },
    config.jwt.refresh_secret as string,
    config.jwt.jwt_refresh_expiration as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// refreshToken
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isActive: true,
    },
  });

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      image: userData?.image || defaultUserImage,
      name: userData.name,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiration as string
  );

  return {
    accessToken,
  };
};

// changePasswordIntoDB
const changePasswordIntoDB = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      isActive: true,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const isPassswordCorrect: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPassswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Credentials!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  return updateData;
};

// forgetPassword
const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isActive: true,
    },
  });

  const resetPasswordToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
      image: userData?.image || defaultUserImage,
      name: userData.name,
    },
    config.password.reset_password_secret!,
    config.password.reset_password_expiration!
  );

  const resetPasswordLink =
    config.password.reset_password_link +
    `?id=${userData.id}&token=${resetPasswordToken}`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background-color: #2e7d32; /* Changed to green */
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .reset-button {
        display: inline-block;
        background-color: #2e7d32; /* Changed to green */
        color: white !important;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 15px 0;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 15px;
        text-align: center;
        font-size: 12px;
      }
      .warning {
        color: #d9534f;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🌳🌴🌲 Password Reset Request</h1>
    </div>

    <div class="content">

      <p>We received a request to reset your EcoRoots account password.</p>

      <center>
        <a href="${resetPasswordLink}" class="reset-button">
          Reset Password
        </a>
      </center>

      <p class="warning">⚠️ This link will expire in <strong>10 minutes</strong>.</p>

      <p>If you didn't request this password reset, please:</p>
      <ol>
        <li>Ignore this email</li>
        <li>Secure your account</li>
        <li>Contact our support team if you notice suspicious activity</li>
      </ol>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Think Greenly. All rights reserved.</p>
      <p>For security reasons, we never ask for your password via email.</p>
    </div>
  </body>
  </html>
`;

  await sendEmail(userData.email, html);
  return null;
};

// resetPassword
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      isActive: true,
    },
  });

  const isValidToken = verifyToken(
    token,
    config.password.reset_password_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
  }

  const hashPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashPassword,
      passwordChangedAt: new Date(),
    },
  });

  return result;
};

export const authServices = {
  loginUserIntoDB,
  refreshToken,
  changePasswordIntoDB,
  forgetPassword,
  resetPassword,
};
