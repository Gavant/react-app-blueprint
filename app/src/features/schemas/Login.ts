import { z } from 'zod';

import { emailSchema, passwordSchema } from '~/features/schemas/Generic';

export const LoginSchema = z
    .object({
        password: passwordSchema,
        username: emailSchema,
    })
    .required();

export type LoginForm = z.infer<typeof LoginSchema>;
