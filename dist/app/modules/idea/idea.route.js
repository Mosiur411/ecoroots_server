"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinaryImageUploader_1 = require("../../utils/cloudinaryImageUploader");
const idea_controller_1 = require("./idea.controller");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const idea_validation_1 = require("./idea.validation");
const IdeaRoutes = (0, express_1.Router)();
IdeaRoutes.post('/draft', cloudinaryImageUploader_1.uploadFile.array('images', 10), (0, auth_1.auth)(client_1.Role.MEMBER, client_1.Role.ADMIN), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(idea_validation_1.ideaValidationSchemas.draftAnIdea), idea_controller_1.IdeaControllers.draftAnIdea);
IdeaRoutes.post('/', cloudinaryImageUploader_1.uploadFile.array('images', 10), (0, auth_1.auth)(client_1.Role.MEMBER, client_1.Role.ADMIN), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(idea_validation_1.ideaValidationSchemas.createAnIdea), idea_controller_1.IdeaControllers.createAnIdea);
IdeaRoutes.get('/getOwnIdeas', (0, auth_1.auth)(client_1.Role.MEMBER), idea_controller_1.IdeaControllers.getOwnAllIdeas);
IdeaRoutes.get('/', idea_controller_1.IdeaControllers.getAllIdeas);
IdeaRoutes.get('/:id', idea_controller_1.IdeaControllers.getSingleIdea);
IdeaRoutes.put('/:id', cloudinaryImageUploader_1.uploadFile.array('images', 10), (0, auth_1.auth)(client_1.Role.MEMBER, client_1.Role.ADMIN), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(idea_validation_1.ideaValidationSchemas.createAnIdea), idea_controller_1.IdeaControllers.updateAIdea);
IdeaRoutes.delete('/:id', idea_controller_1.IdeaControllers.deleteAIdea);
exports.default = IdeaRoutes;
