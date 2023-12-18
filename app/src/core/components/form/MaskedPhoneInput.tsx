import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { PatternFormatProps } from 'react-number-format';

import MaskedPatternInput from '~/core/components/form/MaskedPatternInput';
import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MASK_FORMAT = '(###) ###-####';
const MASK_FORMAT_WITH_EXT = '(###) ###-#### x####';
const MASK_CHARACTER = '_';

type MaskedPhoneInputProps = Omit<PatternFormatProps<TextFieldProps>, 'format'> & {
    includeExtension?: boolean;
};

// TODO documentation
const MaskedPhoneInput = forwardRef<HTMLInputElement, MaskedPhoneInputProps>(function MaskedPhoneInput(
    { includeExtension, onChange, ...rest },
    ref
) {
    return (
        <MaskedPatternInput
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, rest.name))}
            {...rest}
            format={includeExtension ? MASK_FORMAT_WITH_EXT : MASK_FORMAT}
            mask={MASK_CHARACTER}
        />
    );
});

export default MaskedPhoneInput;
