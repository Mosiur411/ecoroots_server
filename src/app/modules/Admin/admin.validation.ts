import { z } from 'zod';

const userStatusValidation = z.object({
  body: z.object({
    isActive: z.boolean({
      required_error: 'isActive is required!',
    }),
  }),
});

const ideaStatusValidation = z.object({
  body: z.object({
    status: z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED'], {
      required_error: 'status is required!',
    }),
    feedback: z
      .string({
        required_error: 'feedback is required!',
      })
      .optional(),
  }),
});

export const adminValidationSchemas = {
  userStatusValidation,
  ideaStatusValidation,
};
