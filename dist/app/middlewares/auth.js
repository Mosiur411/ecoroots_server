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
exports.auth = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const httpStatus_1 = require("../utils/httpStatus");
const jwtHelper_1 = require("../utils/jwtHelper");
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const prisma_1 = __importDefault(require("../config/prisma"));
const authHelpers_1 = require("../helpers/authHelpers");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(httpStatus_1.httpStatus.UNAUTHORIZED, 'You are not authorized');
        }
        const decoded = (0, jwtHelper_1.verifyToken)(token, config_1.default.jwt.jwt_secret);
        const { email, role, iat } = decoded;
        // checking if the user is exist
        // const user = await findUser({ email });
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email,
                isActive: true,
            },
        });
        if (!user) {
            throw new AppError_1.default(httpStatus_1.httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }
        // checking if any hacker using a token even-after the user changed the password
        if (user.passwordChangedAt &&
            (yield (0, authHelpers_1.isTokenIssuedBeforePasswordChange)(user.passwordChangedAt, iat))) {
            throw new AppError_1.default(httpStatus_1.httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError_1.default(httpStatus_1.httpStatus.UNAUTHORIZED, 'You are not authorized yet!');
        }
        req.user = Object.assign(Object.assign({}, decoded), { id: user.id });
        next();
    }));
};
exports.auth = auth;
