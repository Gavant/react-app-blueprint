import { zodResolver } from '@hookform/resolvers/zod';
import { act } from 'react';
import { useForm } from 'react-hook-form';
import { describe, expect, it, Mock, vi } from 'vitest';
import { SomeZodObject, z } from 'zod';

import withFormField from '../withTextField';

import { render, screen } from '~/vitest/utils';

interface FormComponentProps {
    field: string;
    label: string;
    schema: SomeZodObject;
    submit?: Mock;
}
// react function component  to render the form with useForm hook from react-hook-form
const FormComponent = (props: FormComponentProps) => {
    const form = useForm({
        resolver: zodResolver(props.schema),
    });
    props.submit?.mockImplementation(form.trigger);

    const TextFieldComponent = withFormField(form.control, props.schema);
    return <TextFieldComponent {...props} />;
};

describe('WithTextField', () => {
    it('renders the text field with the correct label', () => {
        const schema = z.object({
            test: z.string().min(1, 'Required').max(50, 'Too long'),
        });

        render(<FormComponent field="test" label="Test Field" schema={schema} />);

        expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    });

    it('displays an error message when the field is required and left empty', async () => {
        const schema = z.object({
            test: z.string(),
        });

        const onSubmit = vi.fn();
        render(<FormComponent field="test" label="Test Field" schema={schema} submit={onSubmit} />);

        await act(async () => {
            await onSubmit();
        });

        expect(screen.getByLabelText('Test Field is required')).toBeInTheDocument();
    });

    it('does not display an error message when the field is not required and left empty', async () => {
        const schema = z.object({
            test: z.string().optional(),
        });

        const onSubmit = vi.fn();
        render(<FormComponent field="test" label="Test Field" schema={schema} submit={onSubmit} />);

        await act(async () => {
            await onSubmit();
        });

        expect(screen.queryByText('Test Field is required')).not.toBeInTheDocument();
    });
});
