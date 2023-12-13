import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, forwardRef } from 'react';
import { NumberFormatBase, NumericFormatProps, usePatternFormat } from 'react-number-format';
import { FormatInputValueFunction } from 'react-number-format/types/types';

const MASK_FORMAT = '##/##';

const patternFormatter = (format?: FormatInputValueFunction) => (val: string) => {
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && Number(month[0]) > 1) {
        month = `0${month[0]}`;
    } else if (month.length === 2) {
        if (Number(month) === 0) {
            month = `01`;
        } else if (Number(month) > 12) {
            month = '12';
        }
    }

    return format?.(`${month}${year}`) ?? '';
};

// TODO documentation
const MaskedExpirationInput = forwardRef<HTMLInputElement, NumericFormatProps<TextFieldProps>>(function MaskedExpirationInput(props, ref) {
    const { onChange, ...other } = props;
    const { format, ...rest } = usePatternFormat({ ...props, format: MASK_FORMAT });
    const formatter = patternFormatter(format);

    return (
        <NumberFormatBase
            customInput={TextField}
            format={formatter}
            getInputRef={ref}
            onValueChange={(values, sourceInfo) => {
                onChange?.({
                    ...(sourceInfo.event ?? {}),
                    target: {
                        ...(sourceInfo.event?.target ?? {}),
                        name: props.name ?? '',
                        value: values.formattedValue ?? '',
                    },
                } as ChangeEvent<HTMLInputElement>);
            }}
            {...other}
            {...rest}
        />
    );
});

export default MaskedExpirationInput;
