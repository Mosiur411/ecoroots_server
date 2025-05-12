import { z } from 'zod';

// createPayment
const createPayment = z.object({
  body: z.object({
    ideaId: z
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
const validatePayment = z.object({
  query: z.object({
    tran_id: z.string({
      required_error: 'Transaction ID is required!',
      invalid_type_error: 'Transaction ID must be string!',
    }),
  }),
});

export const paymentValidation = {
  createPayment,
  // changePaymentStatus,
  validatePayment,
};
