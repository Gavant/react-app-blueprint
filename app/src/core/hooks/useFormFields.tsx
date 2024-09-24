import { useMemo } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { SomeZodObject } from 'zod';

import withAutocompleteField from '~/core/components/withAutocompleteField';
import withFormField from '~/core/components/withTextField';

const useFormFields = <T extends FieldValues, Z extends SomeZodObject>({ control, schema }: { control: Control<T>; schema: Z }) => {
    return {
        Autocomplete: useMemo(() => withAutocompleteField<T, Z>(control, schema), [control, schema]),
        Text: useMemo(() => withFormField<T, Z>(control, schema), [control, schema]),
    };
};

export default useFormFields;
