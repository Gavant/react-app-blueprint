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

export function castNumericMaskedValues<T>(values: T, props: string[]) {
    return {
        ...values,
        // TODO fix TS issues -- can we infer the available props/props that are numbers programmatically with the given type arg?
        ...props.reduce((agg, prop) => ({ ...agg, [prop]: Number(values[prop]) }), {}),
    };
}
