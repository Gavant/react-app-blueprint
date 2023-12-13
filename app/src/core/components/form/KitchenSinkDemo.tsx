import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';

import MaskedCurrencyInput from '~/core/components/form/MaskedCurrencyInput';
import MaskedCurrencyInputRTL from '~/core/components/form/MaskedCurrencyInputRTL';
import MaskedExpirationInput from '~/core/components/form/MaskedExpirationInput';
import MaskedNumberInput from '~/core/components/form/MaskedNumberInput';

const Form = styled.form`
    margin: 0 auto;
    width: 20rem;
`;

interface FormValues {
    basic: string;
    ccExpire: string;
    currency: string;
    currencyRtl: string;
    pct: string;
}

export default function KitchenSinkDemo() {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { currency: '', currencyRtl: '0' } });

    const onSubmit: SubmitHandler<FormValues> = (data) => console.log('submitted', data);

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <div>
                    <strong>Numeric Masks</strong>
                </div>
                <Controller
                    control={control}
                    name="basic"
                    render={({ field }) => <MaskedNumberInput error={!!errors.basic} label="Basic Number" {...field} />}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="pct"
                    render={({ field }) => (
                        <MaskedNumberInput decimalScale={0} error={!!errors.pct} label="Percentage (no decimals)" suffix="%" {...field} />
                    )}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => <MaskedCurrencyInput error={!!errors.currency} label="Currency" {...field} />}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="currencyRtl"
                    render={({ field }) => <MaskedCurrencyInputRTL error={!!errors.currencyRtl} label="Currency RTL" {...field} />}
                    rules={{ required: true }}
                />
                <div>Pattern Masks</div>
                {/* TODO Phone Num (with optional ext) */}
                <Controller
                    control={control}
                    name="ccExpire"
                    render={({ field }) => <MaskedExpirationInput error={!!errors.ccExpire} label="CC Expire" {...field} />}
                    rules={{ required: true }}
                />
                {/* TODO CC Num */}
                <Button type="submit" variant="outlined">
                    Submit
                </Button>
            </Stack>
        </Form>
    );
}
