import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';

import MaskedCurrencyInput from '~/core/components/form/MaskedCurrencyInput';
import MaskedCurrencyInputRTL from '~/core/components/form/MaskedCurrencyInputRTL';
import MaskedExpirationInput from '~/core/components/form/MaskedExpirationInput';
import MaskedNumberInput from '~/core/components/form/MaskedNumberInput';
import MaskedPatternInput from '~/core/components/form/MaskedPatternInput';
import MaskedPhoneInput from '~/core/components/form/MaskedPhoneInput';
import MaskedSecureInput from '~/core/components/form/MaskedSecureInput';

const Form = styled.form`
    margin: 0 auto;
    width: 20rem;
`;

interface FormValues {
    basic: string;
    ccExpire: string;
    ccNum: string;
    currency: string;
    currencyRtl: string;
    pct: string;
    phone: string;
    ssn: string;
    zip: string;
}

export default function KitchenSinkDemo() {
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { currency: '', currencyRtl: '0', phone: '' } });

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
                <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => <MaskedPhoneInput error={!!errors.phone} label="Phone" {...field} />}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="ccExpire"
                    render={({ field }) => <MaskedExpirationInput error={!!errors.ccExpire} label="CC Expire (MM/YY)" {...field} />}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="ccNum"
                    render={({ field }) => (
                        <MaskedPatternInput error={!!errors.ccNum} format="#### #### #### ####" label="CC Number" {...field} />
                    )}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="ssn"
                    render={({ field }) => <MaskedSecureInput error={!!errors.ssn} format="###-##-####" label="SSN" {...field} />}
                    rules={{ required: true }}
                />
                <Controller
                    control={control}
                    name="zip"
                    render={({ field }) => <MaskedPatternInput error={!!errors.zip} format="#####-####" label="Zip Code" {...field} />}
                    rules={{ required: true }}
                />
                <Button type="submit" variant="outlined">
                    Submit
                </Button>
            </Stack>
        </Form>
    );
}
