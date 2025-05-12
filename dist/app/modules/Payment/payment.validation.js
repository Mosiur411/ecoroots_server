"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = void 0;
const zod_1 = require("zod");
// createPayment
const createPayment = zod_1.z.object({
    body: zod_1.z.object({
        ideaId: zod_1.z
            .string({
            required_error: 'Amount is required!',
            invalid_type_error: 'Amount must be string!',
        })
            .trim(),
    }),
});
// // changePaymentStatus
// const changePaymentStatus = z.object({
//   body: z.object({
//     status: z.enum(['Paid', 'Failed'], {
//       errorMap: () => ({
//         message: "Update status must be one of 'Paid' and 'Failed'!",
//       }),
//     }),
//   }),
//   // params: z.object({
//   //   paymentId: z.string({
//   //     required_error: 'Payment ID is required!',
//   //     invalid_type_error: 'Payment ID must be string!',
//   //   }),
//   // }), // no need to use as params works as URL
// });
// validatePayment
const validatePayment = zod_1.z.object({
    query: zod_1.z.object({
        tran_id: zod_1.z.string({
            required_error: 'Transaction ID is required!',
            invalid_type_error: 'Transaction ID must be string!',
        }),
    }),
});
exports.paymentValidation = {
    createPayment,
    // changePaymentStatus,
    validatePayment,
};
