import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef, useState } from 'react';
import { PatternFormatProps } from 'react-number-format';

import MaskedPatternInput from '~/core/components/form/MaskedPatternInput';
import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MaskedSecureInput = forwardRef<HTMLInputElement, PatternFormatProps<TextFieldProps>>(function MaskedSecureInput(
    { onChange, ...rest },
    ref
) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <MaskedPatternInput
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
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
            type={isFocused ? 'text' : 'password'}
        />
    );
});

export default MaskedSecureInput;
