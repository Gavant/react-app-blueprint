import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef, useState } from 'react';
import { NumberFormatBase, NumericFormatProps, usePatternFormat } from 'react-number-format';
import { FormatInputValueFunction } from 'react-number-format/types/types';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MASK_FORMAT = '##/##';
const MASK_CHARACTER = '_';

const patternFormatter = (format?: FormatInputValueFunction) => (val: string) => {
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && Number(month[0]) > 1) {
        month = `0${month[0]}`;
    } else if (month.length === 2) {
        if (Number(month) === 0) {
            month = `01`;
        } else if (Number(month) > 12) {
            month = '12';
        }
    }

    return format?.(`${month}${year}`) ?? '';
};

const MaskedExpirationInput = forwardRef<HTMLInputElement, NumericFormatProps<TextFieldProps>>(function MaskedExpirationInput(
    { onChange, ...rest },
    ref
) {
    const [isFocused, setIsFocused] = useState(false);
    const { format, ...formatProps } = usePatternFormat({
        ...rest,
        allowEmptyFormatting: isFocused,
        format: MASK_FORMAT,
        mask: MASK_CHARACTER,
    });
    const formatter = patternFormatter(format);

    return (
        <NumberFormatBase
            customInput={TextField}
            format={formatter}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name, 'formattedValue'))}
            {...rest}
            {...formatProps}
            onBlur={(event) => {
                setIsFocused(false);
                rest.onBlur?.(event);
            }}
            onFocus={(event) => {
                setIsFocused(true);
                rest.onFocus?.(event);
            }}
        />
    );
});

export default MaskedExpirationInput;
