import { useMemo } from 'react';
import { Control, FieldValues } from 'react-hook-form';

import withAutocompleteField from '~/core/components/withAutocompleteField';
import withFormField from '~/core/components/withTextField';

const useFormFields = <T extends FieldValues>(controller: Control<T>) => {
    return {
        Autocomplete: useMemo(() => withAutocompleteField<T>(controller), [controller]),
        Text: useMemo(() => withFormField<T>(controller), [controller]),
    };
};

export default useFormFields;
