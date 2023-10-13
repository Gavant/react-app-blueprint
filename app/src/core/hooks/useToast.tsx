import { useContext } from 'react';

import { ToastContext } from '~/core/stores/toastContext';

function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a AlertProvider');
    }
    return context;
}

export default useToast;
