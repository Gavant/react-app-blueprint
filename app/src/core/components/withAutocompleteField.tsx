import { AutocompleteProps, FormControl, Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import { FC } from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import styled from 'styled-components';

import { ArrayMemberType } from '~/core/utils/typescript';

const Autocomplete = styled(MuiAutocomplete)`
    && {
        &.Mui-disabled > div {
            cursor: not-allowed;
        }
        .MuiOutlinedInput-root {
            background: ${({ theme }) => theme.palette.common.white};
            border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        }
    }
`;

type Options = Record<string, unknown>[];

export interface WithAutocompleteProps<
    FV extends FieldValues,
    O extends Options,
    P extends Path<FV>,
    Opt extends ArrayMemberType<O> = ArrayMemberType<O>,
> extends Omit<AutocompleteProps<Opt, false, false, false>, 'onChange' | 'renderInput'> {
    field: P;
    getOptionValue?: (option: PathValue<FV, P>) => Opt | null | undefined;
    label: string;
    onChange?: (value: Opt | null) => void;
    options: Opt[];
    renderInput?: Pick<AutocompleteProps<Opt, false, false, false>, 'renderInput'>['renderInput'];
    type?: string;
}

const withAutocompleteField = <FV extends FieldValues>(controller: Control<FV>) => {
    const ResultComponent = <O extends Options, Opt extends ArrayMemberType<O> = ArrayMemberType<O>, P extends Path<FV> = Path<FV>>({
        field,
        getOptionLabel,
        getOptionValue,
        label,
        options,
        renderInput,
        ...props
    }: WithAutocompleteProps<FV, O, P, Opt>) => {
        return (
            <FormControl fullWidth>
                <Controller
                    control={controller}
                    name={field}
                    render={({ field: { onChange: formOnChange, value }, fieldState: { error } }) => {
                        const translatedValue = getOptionValue
                            ? getOptionValue(value) ?? value
                            : options.find((option) => option.id === value);
                        const newValue = translatedValue === undefined ? null : translatedValue;

                        const translatedOnChange = (_event: any, newValue: unknown) => {
                            props?.onChange?.(newValue as Opt | null);
                            return formOnChange((newValue as Opt | null)?.id ?? null);
                        };

                        const translatedGetOptionLabel = (option: unknown): string => {
                            return typeof option === 'string' ? (option as string) : getOptionLabel?.(option as Opt) ?? '';
                        };

                        return (
                            <Autocomplete<FC<AutocompleteProps<Opt, false, false, false>>>
                                {...props}
                                autoHighlight={props.autoHighlight ?? true}
                                getOptionLabel={translatedGetOptionLabel}
                                onChange={translatedOnChange}
                                options={options}
                                renderInput={(params) => {
                                    return renderInput ? (
                                        renderInput(params)
                                    ) : (
                                        <TextField
                                            color="secondary"
                                            {...params}
                                            autoComplete="off"
                                            error={!!error?.type}
                                            helperText={error?.type ? `${label} ${error?.type ? 'is required' : ''}` : undefined}
                                            label={`${label} ${error?.type === 'required' ? '*' : ''}`}
                                            onChange={formOnChange}
                                            value={value}
                                        />
                                    );
                                }}
                                value={newValue}
                            />
                        );
                    }}
                />
            </FormControl>
        );
    };
    ResultComponent.displayName = 'AutocompleteField';
    return ResultComponent;
};

export default withAutocompleteField;
