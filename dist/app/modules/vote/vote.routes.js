"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRoutes = void 0;
const vote_controller_1 = require("./vote.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const vote_validation_1 = require("./vote.validation");
const auth_1 = require("../../middlewares/auth");
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), (0, validateRequest_1.default)(vote_validation_1.voteValidationSchema), vote_controller_1.voteController.createOrUpdateVote);
router.delete('/:ideaId', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), (0, validateRequest_1.default)(vote_validation_1.deleteVoteValidationSchema), vote_controller_1.voteController.removeVote);
router.get('/stats/:ideaId', (0, validateRequest_1.default)(vote_validation_1.getVoteStatsValidationSchema), vote_controller_1.voteController.getVoteStats);
router.get('/:ideaId', (0, auth_1.auth)(client_1.Role.ADMIN, client_1.Role.MEMBER), (0, validateRequest_1.default)(vote_validation_1.getVoteStatsValidationSchema), vote_controller_1.voteController.getUserVote);
router.get('/ideas/by-votes', vote_controller_1.voteController.getAllIdeasByVotes);
exports.voteRoutes = router;
