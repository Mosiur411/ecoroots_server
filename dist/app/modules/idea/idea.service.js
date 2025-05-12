"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.IdeaServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const idea_utilities_1 = require("./idea.utilities");
const paginationHelper_1 = require("../../builder/paginationHelper");
class IdeaServices {
    // draftAnIdeaIntoDB
    static draftAnIdeaIntoDB(userData, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.price = payload.price ? Number(payload.price) : 0;
            payload.authorId = userData.id;
            payload.isPaid = payload.price > 0;
            if (payload.id) {
                // Update a previously created draft (upsert)
                const result = yield prisma_1.default.idea.upsert({
                    where: {
                        id: payload.id,
                    },
                    update: payload,
                    create: payload,
                });
                return result;
            }
            else {
                // Create a draft (no id provided)
                const result = yield prisma_1.default.idea.create({
                    data: payload,
                });
                return result;
            }
        });
    }
    // createAnIdeaIntoDB
    static createAnIdeaIntoDB(userData, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.price = Number(payload.price);
            payload.authorId = userData.id;
            payload.status = client_1.IdeaStatus.UNDER_REVIEW;
            payload.isPaid = payload.price > 0;
            // const result = await prisma.idea.upsert({
            //   where: {
            //     id: payload.id,
            //   },
            //   update: payload,
            //   create: payload,
            // });
            // return result;
            if (payload.id) {
                // Update a previously created draft (upsert)
                const result = yield prisma_1.default.idea.upsert({
                    where: {
                        id: payload.id,
                    },
                    update: payload,
                    create: payload,
                });
                return result;
            }
            else {
                // Create a draft (no id provided)
                const result = yield prisma_1.default.idea.create({
                    data: payload,
                });
                return result;
            }
        });
    }
}
exports.IdeaServices = IdeaServices;
_a = IdeaServices;
// getAllIdeasFromDB
IdeaServices.getAllIdeasFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const filterOptions = (0, idea_utilities_1.ideaFilters)(params);
    const result = yield prisma_1.default.idea.findMany({
        where: Object.assign(Object.assign({}, filterOptions), { status: client_1.IdeaStatus.APPROVED }),
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            votes: true,
            author: true,
            category: true,
            comments: true,
            payments: true,
        },
    });
    const count = yield prisma_1.default.idea.count({
        where: Object.assign(Object.assign({}, filterOptions), { status: client_1.IdeaStatus.APPROVED }),
    });
    return {
        meta: {
            page: page,
            limit: limit,
            total: count,
            totalPage: Math.ceil(count / limit),
        },
        data: result,
    };
});
// get own ideas from DB
IdeaServices.getOwnAllIdeasFromDB = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const filterOptions = (0, idea_utilities_1.ideaFilters)(params);
    const whereOptions = Object.assign({ authorId: user === null || user === void 0 ? void 0 : user.id }, filterOptions);
    const result = yield prisma_1.default.idea.findMany({
        where: whereOptions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            votes: true,
            author: true,
            category: true,
            comments: true,
            payments: true,
        },
    });
    const count = yield prisma_1.default.idea.count({ where: whereOptions });
    return {
        meta: {
            page: page,
            limit: limit,
            total: count,
            totalPage: Math.ceil(count / limit),
        },
        data: result,
    };
});
// getSingleIdeaFromDB
IdeaServices.getSingleIdeaFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield prisma_1.default.idea.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            votes: {
                include: {
                    user: true, // Only include this if your Vote model has a relation to User
                },
            },
            payments: true,
            comments: {
                where: {
                    parentId: null, // Only top-level comments
                },
                include: {
                    user: true,
                    replies: {
                        include: {
                            user: true,
                            replies: {
                                include: {
                                    user: true,
                                    replies: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });
    return idea;
});
// updateIdeaFromDB
IdeaServices.updateIdeaFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const floatPrice = Number(payload.price);
    payload.price = floatPrice;
    const result = yield prisma_1.default.idea.update({
        where: {
            id,
            isDeleted: false,
            OR: [{ status: client_1.IdeaStatus.DRAFT }, { status: client_1.IdeaStatus.UNDER_REVIEW }],
        },
        data: payload,
    });
    return result;
});
// deleteAnIdeaFromDB
IdeaServices.deleteAnIdeaFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.idea.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
