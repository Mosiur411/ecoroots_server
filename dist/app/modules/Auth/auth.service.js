"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const httpStatus_1 = require("../../utils/httpStatus");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("../../utils/jwtHelper");
const sendEmail_1 = require("../../utils/sendEmail");
const global_constants_1 = require("../../constants/global.constants");
// loginUserIntoDB
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            isActive: true,
        },
    });
    const isPassswordCorrect = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isPassswordCorrect) {
        throw new AppError_1.default(httpStatus_1.httpStatus.FORBIDDEN, 'Invalid Credentials');
    }
    const accessToken = (0, jwtHelper_1.generateToken)({
        email: userData.email,
        role: userData.role,
        image: (userData === null || userData === void 0 ? void 0 : userData.image) || global_constants_1.defaultUserImage,
        name: userData.name,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expiration);
    const refreshToken = (0, jwtHelper_1.generateToken)({
        email: userData.email,
        role: userData.role,
        image: (userData === null || userData === void 0 ? void 0 : userData.image) || global_constants_1.defaultUserImage,
        name: userData.name,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.jwt_refresh_expiration);
    return {
        accessToken,
        refreshToken,
    };
});
// refreshToken
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = (0, jwtHelper_1.verifyToken)(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(httpStatus_1.httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            isActive: true,
        },
    });
    const accessToken = (0, jwtHelper_1.generateToken)({
        email: userData.email,
        role: userData.role,
        image: (userData === null || userData === void 0 ? void 0 : userData.image) || global_constants_1.defaultUserImage,
        name: userData.name,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expiration);
    return {
        accessToken,
    };
});
// changePasswordIntoDB
const changePasswordIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
            isActive: true,
        },
    });
    if (!userData) {
        throw new AppError_1.default(httpStatus_1.httpStatus.NOT_FOUND, 'User not found!');
    }
    const isPassswordCorrect = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isPassswordCorrect) {
        throw new AppError_1.default(httpStatus_1.httpStatus.FORBIDDEN, 'Invalid Credentials!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        },
    });
    return updateData;
});
// forgetPassword
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            isActive: true,
        },
    });
    const resetPasswordToken = (0, jwtHelper_1.generateToken)({
        email: userData.email,
        role: userData.role,
        image: (userData === null || userData === void 0 ? void 0 : userData.image) || global_constants_1.defaultUserImage,
        name: userData.name,
    }, config_1.default.password.reset_password_secret, config_1.default.password.reset_password_expiration);
    const resetPasswordLink = config_1.default.password.reset_password_link +
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
    yield (0, sendEmail_1.sendEmail)(userData.email, html);
    return null;
});
// resetPassword
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            isActive: true,
        },
    });
    const isValidToken = (0, jwtHelper_1.verifyToken)(token, config_1.default.password.reset_password_secret);
    if (!isValidToken) {
        throw new AppError_1.default(httpStatus_1.httpStatus.FORBIDDEN, 'Forbidden!');
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            password: hashPassword,
            passwordChangedAt: new Date(),
        },
    });
    return result;
});
exports.authServices = {
    loginUserIntoDB,
    refreshToken,
    changePasswordIntoDB,
    forgetPassword,
    resetPassword,
};
