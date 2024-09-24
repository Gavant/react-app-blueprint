import { FieldError, FieldPath, FieldValues, Path } from 'react-hook-form';
import { SomeZodObject, z } from 'zod';

export function inferSchema<T extends z.ZodTypeAny>(schema: T) {
    return schema;
}

export type InferSchemaType<T extends z.ZodTypeAny> = T extends z.ZodType<infer U> ? U : never;

export function getLabelFromSchema<T extends FieldValues, S extends SomeZodObject, P extends FieldPath<T> = FieldPath<T>>({
    error,
    field,
    label,
    schema,
}: {
    error?: FieldError;
    field: P;
    label?: string;
    schema: S;
}) {
    return error?.type === 'invalid_type' && !schema?.shape?.[field].isOptional()
        ? `${label} is required`
        : error?.message
        ? error.message
        : !schema?.shape?.[field].isOptional()
        ? `${label}*`
        : label;
}
