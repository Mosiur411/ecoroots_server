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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdeaControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const cloudinaryImageUploader_1 = require("../../utils/cloudinaryImageUploader");
const httpStatus_1 = require("../../utils/httpStatus");
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const idea_constants_1 = require("./idea.constants");
const idea_service_1 = require("./idea.service");
class IdeaControllers {
}
exports.IdeaControllers = IdeaControllers;
_a = IdeaControllers;
// draftAnIdea
IdeaControllers.draftAnIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    if (req.files && req.files instanceof Array) {
        const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
            const imageName = `${uniqueSuffix}-${(_b = req.user) === null || _b === void 0 ? void 0 : _b.email.split('@')[0]}`;
            const path = file === null || file === void 0 ? void 0 : file.buffer;
            const { secure_url } = yield (0, cloudinaryImageUploader_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = [...payload.images, ...imageUrls];
    }
    const result = yield idea_service_1.IdeaServices.draftAnIdeaIntoDB(req.user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea drafted successfully!',
        data: result,
    });
}));
// createAnIdea
IdeaControllers.createAnIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    if (req.files && req.files instanceof Array) {
        const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
            const imageName = `${uniqueSuffix}-${(_b = req.user) === null || _b === void 0 ? void 0 : _b.email.split('@')[0]}`;
            const path = file === null || file === void 0 ? void 0 : file.buffer;
            const { secure_url } = yield (0, cloudinaryImageUploader_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = [...imageUrls];
    }
    const result = yield idea_service_1.IdeaServices.createAnIdeaIntoDB(req.user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea posted successfully!',
        data: result,
    });
}));
// getAllIdeas
IdeaControllers.getAllIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, idea_constants_1.ideaFilterOptions);
    const options = (0, pick_1.default)(req.query, idea_constants_1.ideaPaginationOption);
    const result = yield idea_service_1.IdeaServices.getAllIdeasFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Ideas fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// get all own ideas
IdeaControllers.getOwnAllIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, idea_constants_1.ideaFilterOptions);
    const options = (0, pick_1.default)(req.query, idea_constants_1.ideaPaginationOption);
    const result = yield idea_service_1.IdeaServices.getOwnAllIdeasFromDB(filters, options, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Ideas fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// getSingleIdea
IdeaControllers.getSingleIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield idea_service_1.IdeaServices.getSingleIdeaFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea fetched successfully!',
        data: result,
    });
}));
// updateAIdea
IdeaControllers.updateAIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Check if new image files are uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e3);
            const imageName = `${uniqueSuffix}-${(_b = req.user) === null || _b === void 0 ? void 0 : _b.email.split('@')[0]}`;
            const path = file === null || file === void 0 ? void 0 : file.buffer;
            const { secure_url } = yield (0, cloudinaryImageUploader_1.sendImageToCloudinary)(imageName, path);
            return secure_url;
        })));
        payload.images = imageUrls;
    }
    else {
        const existingIdea = yield idea_service_1.IdeaServices.getSingleIdeaFromDB(req.params.id);
        if (existingIdea) {
            payload.images = existingIdea.images;
        }
    }
    const result = yield idea_service_1.IdeaServices.updateIdeaFromDB(req.params.id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea updated successfully!',
        data: result,
    });
}));
// deleteAIdea
IdeaControllers.deleteAIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield idea_service_1.IdeaServices.deleteAnIdeaFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: httpStatus_1.httpStatus.OK,
        message: 'Idea deleted successfully',
        data: null,
    });
}));
