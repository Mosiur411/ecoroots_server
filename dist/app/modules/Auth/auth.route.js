"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authControllers.loginUser);
router.post('/refresh-token', auth_controller_1.authControllers.refreshToken);
router.patch('/change-password', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), auth_controller_1.authControllers.changePassword);
router.post('/forget-password', auth_controller_1.authControllers.forgetPassword);
router.post('/reset-password', auth_controller_1.authControllers.resetPassword);
exports.authRoutes = router;
