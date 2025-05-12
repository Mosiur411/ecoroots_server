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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const paginationHelper_1 = require("../../builder/paginationHelper");
const conditionsBuilder_1 = require("../../builder/conditionsBuilder");
const category_constants_1 = require("./category.constants");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const httpStatus_1 = require("../../utils/httpStatus");
// createCategoryIntoDB
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.name) {
        throw new AppError_1.default(httpStatus_1.httpStatus.BAD_REQUEST, "Must give a name for the Title");
    }
    const result = yield prisma_1.default.category.create({
        data: {
            name: payload.name,
        },
    });
    return result;
});
// getAllCategoriesFromDB
const getAllCategoriesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, category_constants_1.CategoryFields);
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.category.findMany({
        where: Object.assign({}, whereConditions),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const count = yield prisma_1.default.category.count({
        where: Object.assign({}, whereConditions),
    });
    return {
        meta: {
            page,
            limit,
            total: count,
            totalPage: Math.ceil(count / limit),
        },
        data: result,
    };
});
exports.CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};
