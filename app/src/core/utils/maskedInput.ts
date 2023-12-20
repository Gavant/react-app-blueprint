import { ChangeEvent } from 'react';
import { NumberFormatValues, SourceInfo } from 'react-number-format';

type MaskedValueProp = 'floatValue' | 'formattedValue' | 'value';

export function formatMaskedValueChangeEvent(
    values: NumberFormatValues,
    sourceInfo: SourceInfo,
    name?: string,
    valueProp: MaskedValueProp = 'value'
) {
    return {
        ...(sourceInfo.event ?? {}),
        target: {
            ...(sourceInfo.event?.target ?? {}),
            name: name ?? '',
            value: values[valueProp] ?? '',
        },
    } as ChangeEvent<HTMLInputElement>;
}
