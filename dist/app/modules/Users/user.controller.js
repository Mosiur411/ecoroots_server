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
exports.userControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const cloudinaryImageUploader_1 = require("../../utils/cloudinaryImageUploader");
const httpStatus_1 = require("../../utils/httpStatus");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.CREATED,
        message: 'User created successfully',
        data: result,
    });
}));
const changeUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.changeUserStatus(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Users updated Successfully',
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getMyProfile(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Profile fetched Successfully',
        data: result,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getSingleUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'User fetched Successfully',
        data: result,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = req.body;
    if (req === null || req === void 0 ? void 0 : req.file) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
        const imageName = `${uniqueSuffix}-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email.split('@')[0]}`;
        const path = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
        const { secure_url } = yield (0, cloudinaryImageUploader_1.sendImageToCloudinary)(imageName, path);
        payload.image = secure_url;
    }
    else {
        const existingUser = yield user_service_1.userServices.getSingleUserFromDB(req.user.id);
        if (existingUser) {
            payload.image = existingUser.image;
        }
    }
    const { accessToken, refreshToken } = yield user_service_1.userServices.updateProfile(req.user.id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Profile updated successfully',
        data: {
            accessToken,
            refreshToken,
        },
    });
}));
exports.userControllers = {
    createUser,
    changeUserStatus,
    getMyProfile,
    updateProfile,
    getSingleUser,
};
