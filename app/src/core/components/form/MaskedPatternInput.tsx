import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MASK_CHARACTER = '_';

// TODO documentation
const MaskedPatternInput = forwardRef<HTMLInputElement, PatternFormatProps<TextFieldProps>>(function MaskedPatternInput(
    { onChange, ...rest },
    ref
) {
    return (
        <PatternFormat
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
            mask={MASK_CHARACTER}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name))}
            {...rest}
        />
    );
});

export default MaskedPatternInput;
