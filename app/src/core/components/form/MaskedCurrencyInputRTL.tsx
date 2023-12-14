import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, forwardRef } from 'react';
import { NumberFormatBase, NumberFormatBaseProps } from 'react-number-format';

type MaskedCurrencyInputRTLProps = TextFieldProps & {
    currency?: string;
    decimalScale?: number | null;
    fixedDecimalScale?: boolean;
    locale?: string;
};

function formatter(
    value: string = '',
    {
        currency,
        locale,
        maximumFractionDigits,
        minimumFractionDigits,
    }: { currency: string; locale: string; maximumFractionDigits?: number; minimumFractionDigits?: number }
) {
    if (!value) {
        return '';
    }

    return new Intl.NumberFormat(locale, {
        currency,
        maximumFractionDigits,
        minimumFractionDigits,
        style: 'currency',
    }).format(Number(value) / 100);
}

// @see https://github.com/s-yadav/react-number-format/blob/8af37958c69ff1e0252282d37e922a913e52e046/lib/utils.js#L146C2-L170C2
function setCaretPosition(el: HTMLInputElement, caretPos: number) {
    // this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)
    // eslint-disable-next-line
    el.value = el.value;

    if (el !== null) {
        // @ts-expect-error
        if (el.createTextRange) {
            // @ts-expect-error
            const range = el.createTextRange();
            range.move('character', caretPos);
            range.select();
            return true;
        } // (el.selectionStart === 0 added for Firefox bug)

        if (el.selectionStart || el.selectionStart === 0) {
            el.focus();
            el.setSelectionRange(caretPos, caretPos);
            return true;
        } // fail city, fortunately this never happens (as far as I've tested) :)

        el.focus();
        return false;
    }
}

// TODO documentation
const MaskedCurrencyInputRTL = forwardRef<HTMLInputElement, NumberFormatBaseProps<MaskedCurrencyInputRTLProps>>(
    function MaskedCurrencyInputRTL(
        { currency = 'USD', decimalScale = 2, fixedDecimalScale = true, locale = 'en-US', onChange, onFocus, ...rest },
        ref
    ) {
        const minimumFractionDigits = decimalScale ?? undefined;
        const maximumFractionDigits = fixedDecimalScale && minimumFractionDigits ? minimumFractionDigits : undefined;

        return (
            <NumberFormatBase
                customInput={TextField}
                format={(value) => formatter(value, { currency, locale, maximumFractionDigits, minimumFractionDigits })}
                getInputRef={ref}
                inputProps={{
                    inputMode: 'decimal',
                }}
                onValueChange={(values, sourceInfo) => {
                    onChange?.({
                        ...(sourceInfo.event ?? {}),
                        target: {
                            ...(sourceInfo.event?.target ?? {}),
                            name: rest.name ?? '',
                            value: `${((values.floatValue ?? 0) / 100).toFixed(decimalScale ?? undefined)}`,
                        },
                    } as ChangeEvent<HTMLInputElement>);
                }}
                {...rest}
                onFocus={(event) => {
                    if (event.target?.value) {
                        setTimeout(() => setCaretPosition(event.target, event.target.value.length), 100);
                    }

                    return onFocus?.(event);
                }}
            />
        );
    }
);

export default MaskedCurrencyInputRTL;
