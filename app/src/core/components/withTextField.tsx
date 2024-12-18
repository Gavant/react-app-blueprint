import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';
import { SomeZodObject } from 'zod';

import { getLabelFromSchema } from '~/core/utils/zod';

export interface WithFormFieldProps<T extends FieldValues, P extends FieldPath<T> = FieldPath<T>> extends FieldValues {
    field: P;
    label?: string;
    options?: RegisterOptions<T, Path<T>>;
    requiredMessage?: string;
    type?: string;
}

const TextField = styled(MuiTextField)`
    && {
        & > .MuiInputBase-root {
            background: ${({ theme }) => theme.palette.background.paper};
        }

        & .MuiInputBase-input.Mui-disabled {
            cursor: not-allowed !important;
        }

        & > p.MuiFormHelperText-root {
            margin: 0;
            padding: 3px 14px 0;
            background: transparent;
        }
    }
`;

const withFormField = <T extends FieldValues, Z extends SomeZodObject>(controller: Control<T>, schema: Z) => {
    const ResultComponent = ({
        field,
        label,
        maxLength = 50, // backend default
        options,
        requiredMessage,
        slotProps,
        type = 'text',
        ...props
    }: TextFieldProps & WithFormFieldProps<T>) => {
        const [shrink, setShrink] = useState(false);

        return (
            <Controller
                control={controller}
                name={field}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        autoComplete={field}
                        color="primary"
                        error={!!error?.type}
                        label={`${getLabelFromSchema({ error, field, label, schema })}`}
                        onBlur={(e) => setShrink(!!e.target.value)}
                        onChange={onChange}
                        onFocus={() => setShrink(true)}
                        slotProps={{
                            htmlInput: { maxLength, ...slotProps?.htmlInput },
                            input: {
                                ...slotProps?.input,
                            },
                            inputLabel: { shrink: shrink || !!value },
                        }}
                        type={type}
                        value={value}
                        {...props}
                    />
                )}
            />
        );
    };
    ResultComponent.displayName = 'FormField';
    return ResultComponent;
};

export default withFormField;
