"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const idea_route_1 = __importDefault(require("../modules/idea/idea.route"));
const category_route_1 = __importDefault(require("../modules/category/category.route"));
const comments_routes_1 = __importDefault(require("../modules/comments/comments.routes"));
const admin_route_1 = require("../modules/Admin/admin.route");
const user_route_1 = require("../modules/Users/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const vote_routes_1 = require("../modules/vote/vote.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/ideas',
        route: idea_route_1.default,
    },
    {
        path: '/categories',
        route: category_route_1.default,
    },
    {
        path: '/comments',
        route: comments_routes_1.default,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRoutes,
    },
    {
        path: '/payments',
        route: payment_routes_1.paymentRoutes,
    },
    {
        path: '/votes',
        route: vote_routes_1.voteRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
