import { zodResolver } from '@hookform/resolvers/zod';
import { act } from 'react';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { describe, expect, it, Mock, vi } from 'vitest';
import { SomeZodObject, z } from 'zod';

import withAutocompleteField from '../withAutocompleteField';

import { render, screen, fireEvent, waitFor } from '~/vitest/utils';
import { debug } from 'vitest-preview';
import userEvent from '@testing-library/user-event';
import { WithAutocompleteProps } from '~/core/components/withAutocompleteField';
import { ArrayMemberType } from '~/core/utils/typescript';

type Options = Record<string, unknown>[];

interface FormComponentProps<
    FV extends FieldValues,
    O extends Options,
    P extends Path<FV>,
    Opt extends ArrayMemberType<O> = ArrayMemberType<O>,
> extends WithAutocompleteProps<FV, O, P, Opt> {
    schema: SomeZodObject;
    submit?: Mock;
}

const FormComponent = <FV extends FieldValues, O extends Options, P extends Path<FV>, Opt extends ArrayMemberType<O> = ArrayMemberType<O>>(
    props: FormComponentProps<FV, O, P, Opt>
) => {
    const form = useForm({
        resolver: zodResolver(props.schema),
    });
    props.submit?.mockImplementation(form.trigger);

    const AutocompleteFieldComponent = withAutocompleteField(form.control, props.schema);
    return <AutocompleteFieldComponent {...props} />;
};

describe('WithAutocompleteField', () => {
    const defaultOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
    ];

    it('renders the autocomplete field with the correct label', () => {
        const schema = z.object({
            test: z.string(),
        });

        render(
            <FormComponent
                field="test"
                label="Test Field"
                schema={schema}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => {
                    return defaultOptions.find((type) => type.value === option);
                }}
                options={defaultOptions}
            />
        );

        expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    });

    it('displays options when clicking the field', async () => {
        const user = userEvent.setup();
        const schema = z.object({
            test: z.string(),
        });

        const onChange = vi.fn();

        render(
            <FormComponent
                field="test"
                label="Test Field"
                schema={schema}
                onChange={onChange}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => {
                    return defaultOptions.find((type) => type.value === option);
                }}
                options={defaultOptions}
            />
        );

        const input = screen.getByLabelText(/Test Field/i);
        await user.click(input);

        await waitFor(() => {
            const option1 = screen.getByRole('option', { name: 'Option 1' });
            const option2 = screen.getByRole('option', { name: 'Option 2' });
            expect(option1).toBeInTheDocument();
            expect(option2).toBeInTheDocument();
            debug();
        });
    });

    it('selects an option when clicked', async () => {
        const user = userEvent.setup();
        const schema = z.object({
            test: z.string(),
        });

        const onChange = vi.fn();

        render(
            <FormComponent
                field="test"
                label="Test Field"
                schema={schema}
                onChange={onChange}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => {
                    return defaultOptions.find((type) => type.value === option);
                }}
                options={defaultOptions}
            />
        );

        const input = screen.getByLabelText(/Test Field/i);
        await user.click(input);
        const option1 = screen.getByRole('option', { name: 'Option 1' });
        await user.click(option1);
        expect(onChange).toHaveBeenCalledWith(defaultOptions[0]);
    });

    it('displays validation error when required field is empty', async () => {
        const schema = z.object({
            test: z.string(),
        });

        const onSubmit = vi.fn();
        render(
            <FormComponent
                field="test"
                label="Test Field"
                schema={schema}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => {
                    return defaultOptions.find((type) => type.value === option);
                }}
                submit={onSubmit}
                options={defaultOptions}
            />
        );

        await act(async () => {
            await onSubmit();
        });

        debug();

        expect(screen.getByLabelText('Test Field is required')).toBeInTheDocument();
    });

    it('filters options based on input', async () => {
        const user = userEvent.setup();
        const schema = z.object({
            test: z.string(),
        });

        render(
            <FormComponent
                field="test"
                label="Test Field"
                schema={schema}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => {
                    return defaultOptions.find((type) => type.value === option);
                }}
                options={defaultOptions}
            />
        );

        const input = screen.getByLabelText(/Test Field/i);
        await user.type(input, '1');

        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Option 2' })).not.toBeInTheDocument();
    });
});
