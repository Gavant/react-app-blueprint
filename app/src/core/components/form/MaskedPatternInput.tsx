import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef, useState } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MASK_CHARACTER = '_';

const MaskedPatternInput = forwardRef<HTMLInputElement, PatternFormatProps<TextFieldProps>>(function MaskedPatternInput(
    { onChange, ...rest },
    ref
) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <PatternFormat
            allowEmptyFormatting={isFocused}
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
            mask={MASK_CHARACTER}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name))}
            {...rest}
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

export default MaskedPatternInput;
