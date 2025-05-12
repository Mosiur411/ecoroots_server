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
exports.userServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../utils/jwtHelper");
const global_constants_1 = require("../../constants/global.constants");
// createUserIntoDB
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const userData = Object.assign(Object.assign({}, payload), { role: client_1.Role.MEMBER, password: hashPassword });
    const result = yield prisma_1.default.user.create({
        data: userData,
    });
    return result;
});
// changeUserStatus
const changeUserStatus = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: payload,
    });
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isActive: true,
        },
    });
    let profileInfo;
    if (userData.role === client_1.Role.ADMIN) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userData.email,
                role: client_1.Role.ADMIN,
            },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
    }
    else if (userData.role === client_1.Role.MEMBER) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userData.email,
                role: client_1.Role.MEMBER,
            },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
    }
    return profileInfo;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
    });
    return result;
});
const updateProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.update({
        where: { id, isActive: true },
        data: payload,
    });
    const accessToken = (0, jwtHelper_1.generateToken)({
        email: user.email,
        role: user.role,
        image: (user === null || user === void 0 ? void 0 : user.image) || global_constants_1.defaultUserImage,
        name: user.name,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expiration);
    const refreshToken = (0, jwtHelper_1.generateToken)({
        email: user.email,
        role: user.role,
        image: (user === null || user === void 0 ? void 0 : user.image) || global_constants_1.defaultUserImage,
        name: user.name,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.jwt_refresh_expiration);
    return {
        accessToken,
        refreshToken,
    };
});
exports.userServices = {
    createUserIntoDB,
    changeUserStatus,
    getMyProfile,
    getSingleUserFromDB,
    updateProfile,
};
