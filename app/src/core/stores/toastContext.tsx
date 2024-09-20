import { AlertColor } from '@mui/material';
import { ReactNode, createContext, useState } from 'react';

type SetToast = (message: string, options?: { autohideDuration?: number; key?: string; open?: boolean }) => void;

export type Toast = {
    error: SetToast;
    info: SetToast;
    success: SetToast;
    warning: SetToast;
};

export type ToastMsg = {
    autohideOverride?: number;
    key: string;
    msg: string;
    open?: boolean;
    severity: AlertColor;
};

export interface ToastContextValue {
    setToast: (toastMsg: ToastMsg) => void;
    toast: Toast;
    toastMsg: ToastMsg | null;
}

const defaultContext: ToastContextValue = {
    setToast: () => {},
    toast: { error: () => {}, info: () => {}, success: () => {}, warning: () => {} },
    toastMsg: null,
};

const ToastContext = createContext<ToastContextValue>(defaultContext);
ToastContext.displayName = 'ToastContext';

export interface ToastProviderProps {
    children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toastMsg, setToastMsg] = useState<ToastMsg | null>(null);

    const createSetToastFunction =
        (severity: AlertColor): SetToast =>
        (message, options) =>
            setToastMsg({
                autohideOverride: options?.autohideDuration ?? undefined,
                key: options?.key ?? message.toLowerCase().replace(/ /g, '-'),
                msg: message,
                open: options?.open ?? true,
                severity,
            });

    const setToast = (toastMsg: ToastMsg) => setToastMsg(toastMsg);

    const toast: Toast = {
        error: createSetToastFunction('error'),
        info: createSetToastFunction('info'),
        success: createSetToastFunction('success'),
        warning: createSetToastFunction('warning'),
    };

    return <ToastContext.Provider value={{ setToast, toast, toastMsg }}>{children}</ToastContext.Provider>;
};

export { ToastContext, ToastProvider };
