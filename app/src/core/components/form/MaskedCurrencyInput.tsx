import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

type MaskedCurrencyInputProps = TextFieldProps;

// TODO documentation
const MaskedCurrencyInput = forwardRef<HTMLInputElement, NumericFormatProps<MaskedCurrencyInputProps>>(function MaskedCurrencyInput(
    { decimalScale = 2, fixedDecimalScale = true, onChange, prefix = '$', ...rest },
    ref
) {
    return (
        <NumericFormat
            customInput={TextField}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            getInputRef={ref}
            inputProps={{
                inputMode: 'decimal',
            }}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name))}
            prefix={prefix}
            thousandSeparator
            {...rest}
        />
    );
});

export default MaskedCurrencyInput;
