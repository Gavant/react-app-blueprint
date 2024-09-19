import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';

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
            background: ${({ theme }) => theme.palette.common.white};
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

const withFormField = <T extends FieldValues>(controller: Control<T>) => {
    const ResultComponent = ({
        field,
        inputProps,
        label,
        maxLength = 50, // backend default
        options,
        required,
        requiredMessage,
        type = 'text',
        ...props
    }: WithFormFieldProps<T> & TextFieldProps) => {
        return (
            <Controller
                control={controller}
                name={field}
                render={({ field: { onChange, value }, fieldState: { error, isDirty } }) => (
                    <TextField
                        autoComplete={field}
                        color="secondary"
                        error={!!error?.type}
                        label={`${
                            error?.type === 'invalid_type' && !isDirty
                                ? `${label} is required`
                                : error?.message
                                ? error.message
                                : required
                                ? `${label}*`
                                : label
                        }`}
                        onChange={onChange}
                        slotProps={{
                            htmlInput: { maxLength, ...inputProps },
                            inputLabel: { shrink: !!value },
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
