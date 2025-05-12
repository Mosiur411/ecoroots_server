"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const cloudinaryImageUploader_1 = require("../../utils/cloudinaryImageUploader");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(user_validation_1.userValidation.createUserSchema), user_controller_1.userControllers.createUser);
router.patch('/profile', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), cloudinaryImageUploader_1.uploadFile.single('image'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, user_controller_1.userControllers.updateProfile);
router.patch('/:id/status', (0, auth_1.auth)(client_1.Role.ADMIN), (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserStatusSchema), user_controller_1.userControllers.changeUserStatus);
router.get('/me', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), user_controller_1.userControllers.getMyProfile);
router.get('/:id', (0, auth_1.auth)(client_1.Role.ADMIN), user_controller_1.userControllers.getSingleUser);
exports.userRoutes = router;
