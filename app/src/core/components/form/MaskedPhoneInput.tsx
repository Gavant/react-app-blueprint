import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, forwardRef } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

const MASK_FORMAT = '(###) ###-####';
const MASK_FORMAT_WITH_EXT = '(###) ###-#### x####';

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
            onValueChange={(values, sourceInfo) => {
                onChange?.({
                    ...(sourceInfo.event ?? {}),
                    target: {
                        ...(sourceInfo.event?.target ?? {}),
                        name: props.name ?? '',
                        value: values.value ?? '',
                    },
                } as ChangeEvent<HTMLInputElement>);
            }}
            {...other}
            format={includeExtension ? MASK_FORMAT_WITH_EXT : MASK_FORMAT}
            mask="_"
        />
    );
});

export default MaskedPhoneInput;
