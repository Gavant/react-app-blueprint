import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';

import MaskedCurrencyInput from '~/core/components/form/MaskedCurrencyInput';

describe('<MaskedCurrencyInput />', () => {
    it('should render', async () => {
        render(<MaskedCurrencyInput label="Label" />);
        const element = screen.getByLabelText('Label');
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    });

    it('should format initial value as currency', async () => {
        render(<MaskedCurrencyInput label="Label" value="12345.67'" />);
        const element = screen.getByLabelText('Label');
        expect(element).toHaveValue('$12,345.67');
    });

    it('should format user-entered numeric input as currency', async () => {
        render(<MaskedCurrencyInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '12345.67');
        expect(element).toHaveValue('$12,345.67');
    });

    it('should not allow user-entered non-numeric input', async () => {
        render(<MaskedCurrencyInput label="Label" />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '123.00abc');
        expect(element).toHaveValue('$123.00');
    });

    it('should output the unformatted value on change', async () => {
        const onChange = vi.fn();
        render(<MaskedCurrencyInput label="Label" onChange={onChange} />);
        const element = screen.getByLabelText('Label');
        await userEvent.type(element, '$12,345.67');
        expect(element).toHaveValue('$12,345.67');
        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '12345.67' }) }));
    });

    describe('react-hook-form', () => {
        function TestForm({ onSubmit }: { onSubmit: SubmitHandler<{ amount: string }> }) {
            const {
                control,
                formState: { errors },
                handleSubmit,
            } = useForm<{ amount: string }>();

            return (
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => <MaskedCurrencyInput error={!!errors.amount} label="Label" {...field} />}
                        rules={{ required: true }}
                    />
                    <button type="submit">Submit</button>
                </form>
            );
        }

        it('should have inter-op with useForm()', async () => {
            const onSubmit = vi.fn();
            render(<TestForm onSubmit={onSubmit} />);
            const element = screen.getByLabelText('Label');
            await userEvent.type(element, '12345.67');
            await userEvent.click(screen.getByText('Submit'));
            expect(onSubmit).toHaveBeenCalledOnce();
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ amount: '12345.67' }), expect.anything());
        });
    });
});
