import { AlertColor } from '@mui/material';
import { createContext, useState } from 'react';
import { ReactNode } from 'react';

type setToast = (message: string, { key, open }?: { key?: string; open?: boolean }) => void;

export interface ToastContextValue {
    setToast: ({ key, msg, open, severity }: { key: string; msg: string; open: boolean; severity: AlertColor }) => void;
    toast: {
        error: setToast;
        info: setToast;
        success: setToast;
        warning: setToast;
    };
    toastMsg: { key: string; msg: string; open?: boolean; severity: AlertColor } | null;
}

const defaultContext = {
    setToast: () => '',
    toast: { error: () => '', info: () => '', success: () => '', warning: () => '' },
    toastMsg: { key: '', msg: '', open: false, severity: 'info' as AlertColor },
};

const ToastContext = createContext<ToastContextValue>(defaultContext);
ToastContext.displayName = 'ToastContext';

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toastMsg, setToastMsg] = useState<{ key: string; msg: string; open: boolean; severity: AlertColor } | null>(null);

    const setToastFunction = (alertType: AlertColor) => (message: string, options?: { key?: string; open?: boolean }) =>
        setToastMsg({ key: options?.key ?? message.toLowerCase().replace(' ', '-'), msg: message, open: true, severity: alertType });

    const setToast = (value: { key: string; msg: string; open: boolean; severity: AlertColor }) => {
        setToastMsg(value);
    };

    const toast = {
        error: setToastFunction('error'),
        info: setToastFunction('info'),
        success: setToastFunction('success'),
        warning: setToastFunction('warning'),
    };

    const value = { setToast, toast, toastMsg };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export { ToastContext, ToastProvider };
