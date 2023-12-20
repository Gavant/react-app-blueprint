import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

type MaskedNumberInputProps = TextFieldProps;

const MaskedNumberInput = forwardRef<HTMLInputElement, NumericFormatProps<MaskedNumberInputProps>>(function MaskedNumberInput(
    { onChange, ...rest },
    ref
) {
    return (
        <NumericFormat
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'decimal',
            }}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name))}
            thousandSeparator
            {...rest}
        />
    );
});

export default MaskedNumberInput;
