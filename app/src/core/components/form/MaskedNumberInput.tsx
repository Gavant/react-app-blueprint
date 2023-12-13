import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

type MaskedNumberInputProps = TextFieldProps;

// TODO documentation
const MaskedNumberInput = forwardRef<HTMLInputElement, NumericFormatProps<MaskedNumberInputProps>>(function MaskedNumberInput(
    { onChange, ...rest },
    ref
) {
    return (
        <NumericFormat
            customInput={TextField}
            getInputRef={ref}
            onValueChange={(values, sourceInfo) => {
                onChange?.({
                    ...(sourceInfo.event ?? {}),
                    target: {
                        ...(sourceInfo.event?.target ?? {}),
                        name: rest.name ?? '',
                        value: values.value ?? '',
                    },
                } as ChangeEvent<HTMLInputElement>);
            }}
            thousandSeparator
            {...rest}
        />
    );
});

export default MaskedNumberInput;
