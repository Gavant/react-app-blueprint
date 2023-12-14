import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { formatMaskedValueChangeEvent } from '~/core/utils/maskedInput';

const MASK_FORMAT = '(###) ###-####';
const MASK_FORMAT_WITH_EXT = '(###) ###-#### x####';
const MASK_CHARACTER = '_';

type MaskedPhoneInputProps = Omit<PatternFormatProps<TextFieldProps>, 'format'> & {
    includeExtension?: boolean;
};

// TODO documentation
const MaskedPhoneInput = forwardRef<HTMLInputElement, MaskedPhoneInputProps>(function MaskedPhoneInput(props, ref) {
    const { includeExtension, onChange, ...other } = props;

    return (
        <PatternFormat
            customInput={TextField}
            getInputRef={ref}
            inputProps={{
                inputMode: 'numeric',
            }}
            onValueChange={(vals, info) => onChange?.(formatMaskedValueChangeEvent(vals, info, props.name))}
            {...other}
            format={includeExtension ? MASK_FORMAT_WITH_EXT : MASK_FORMAT}
            mask={MASK_CHARACTER}
        />
    );
});

export default MaskedPhoneInput;
