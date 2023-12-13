import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, forwardRef } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

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
            prefix={prefix}
            thousandSeparator
            {...rest}
        />
    );
});

export default MaskedCurrencyInput;
