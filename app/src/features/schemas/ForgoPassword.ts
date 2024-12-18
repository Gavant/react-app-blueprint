import { z } from 'zod';

import { emailSchema } from '~/features/schemas/Generic';

export const ForgotPasswordSchema = z.object({
    username: emailSchema,
});

export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
