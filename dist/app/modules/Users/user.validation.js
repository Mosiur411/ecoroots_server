"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).trim(),
        email: zod_1.z.string({ required_error: 'Email is required' }).email(),
        password: zod_1.z.string({ required_error: 'Password is required' }).trim(),
    }),
});
const updateUserStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(Object.values(client_1.Role)).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.userValidation = {
    createUserSchema,
    updateUserStatusSchema,
};
