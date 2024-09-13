import { z } from 'zod';

export function inferSchema<T extends z.ZodTypeAny>(schema: T) {
    return schema;
}

export type InferSchemaType<T extends z.ZodTypeAny> = T extends z.ZodType<infer U> ? U : never;
