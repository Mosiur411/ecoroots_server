"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/users', admin_controller_1.AdminController.getAllUsers);
router.get('/ideas', admin_controller_1.AdminController.getAllIdeas);
router.patch('/ideas/:id/status', admin_controller_1.AdminController.updateIdeaStatus);
router.patch('/user/:id/status', (0, validateRequest_1.default)(admin_validation_1.adminValidationSchemas.userStatusValidation), admin_controller_1.AdminController.updateUserActiveStatus);
router.delete('/ideas/:id', (0, auth_1.auth)(client_1.Role.ADMIN), admin_controller_1.AdminController.deleteAnIdeaFromDB);
exports.adminRoutes = router;
