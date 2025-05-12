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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../builder/paginationHelper");
const prisma_1 = __importDefault(require("../../config/prisma"));
const conditionsBuilder_1 = require("../../builder/conditionsBuilder");
const admin_constant_1 = require("./admin.constant");
// getAllUsersFromDB
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    // Dynamically build query filters
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, admin_constant_1.userFields);
    const whereConditions = andConditions.length > 0
        ? {
            AND: andConditions,
        }
        : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { votes: true, payments: true, comments: true, ideas: true }
    });
    const count = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    // const result = await prisma.user.findMany({
    //   where: {
    //     isActive: true,
    //   },
    //   skip,
    //   take: limit,
    //   orderBy: { [sortBy]: sortOrder },
    // });
    // const count = await prisma.user.count({
    //   where: {
    //     isActive: true,
    //   },
    // });
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
// getAllIdeasFromDB
const getAllIdeasFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelper.calculatePagination(query);
    let andConditions = [];
    // Dynamically build query filters
    andConditions = conditionsBuilder_1.ConditionsBuilder.prisma(query, andConditions, admin_constant_1.ideaFields);
    // Dynamic status filter
    let statusFilter;
    if (query === null || query === void 0 ? void 0 : query.status) {
        statusFilter = {
            status: query.status, // single status filter
        };
    }
    else {
        statusFilter = {
            status: {
                in: [client_1.IdeaStatus.UNDER_REVIEW, client_1.IdeaStatus.APPROVED, client_1.IdeaStatus.REJECTED],
            },
        };
    }
    const whereConditions = andConditions.length > 0
        ? {
            AND: [...andConditions, statusFilter],
        }
        : statusFilter;
    const result = yield prisma_1.default.idea.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            category: true,
            author: true,
        },
    });
    const count = yield prisma_1.default.idea.count({
        where: whereConditions,
    });
    // const result = await prisma.idea.findMany({
    //   where: {
    //     status: {
    //   in: [IdeaStatus.UNDER_REVIEW, IdeaStatus.APPROVED],
    // },
    //   },
    //   skip,
    //   take: limit,
    //   orderBy:
    //     sortBy && sortOrder
    //       ? {
    //           [sortBy]: sortOrder,
    //         }
    //       : {
    //           createdAt: 'desc',
    //         },
    // });
    // const count = await prisma.idea.count({
    //   where: {
    //     status: {
    //       in: [IdeaStatus.UNDER_REVIEW, IdeaStatus.APPROVED],
    //     },
    //   },
    // });
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
// updateIdeaStatusIntoDB
const updateIdeaStatusIntoDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.idea.update({
        where: {
            id,
            isDeleted: false,
        },
        data: Object.assign({}, status),
    });
    return result;
});
// updateUserActiveStatus
const updateUserActiveStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: { isActive: status.isActive || false },
    });
    return result;
});
// deleteAnIdeaFromDB
const deleteAnIdeaFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.idea.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
exports.AdminService = {
    getAllUsersFromDB,
    getAllIdeasFromDB,
    updateIdeaStatusIntoDB,
    updateUserActiveStatus,
    deleteAnIdeaFromDB
};
