"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidationSchemas = void 0;
const zod_1 = require("zod");
const userStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        isActive: zod_1.z.boolean({
            required_error: 'isActive is required!',
        }),
    }),
});
const ideaStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED'], {
            required_error: 'status is required!',
        }),
        feedback: zod_1.z
            .string({
            required_error: 'feedback is required!',
        })
            .optional(),
    }),
});
exports.adminValidationSchemas = {
    userStatusValidation,
    ideaStatusValidation,
};
