import { AlertColor } from '@mui/material';
import { ReactNode, createContext, useState } from 'react';

enum ToastSeverity {
    ERROR = 'error',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
}

type SetToast = (message: string, options?: { autohideDuration?: number; key?: string; open?: boolean }) => void;

export type Toast = {
    [ToastSeverity.ERROR]: SetToast;
    [ToastSeverity.INFO]: SetToast;
    [ToastSeverity.SUCCESS]: SetToast;
    [ToastSeverity.WARNING]: SetToast;
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
    toast: Object.keys(ToastSeverity).reduce((acc, severity) => {
        acc[severity as ToastSeverity] = () => {};
        return acc;
    }, {} as Toast),
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
        (severity: ToastSeverity): SetToast =>
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
        error: createSetToastFunction(ToastSeverity.ERROR),
        info: createSetToastFunction(ToastSeverity.INFO),
        success: createSetToastFunction(ToastSeverity.SUCCESS),
        warning: createSetToastFunction(ToastSeverity.WARNING),
    };

    return <ToastContext.Provider value={{ setToast, toast, toastMsg }}>{children}</ToastContext.Provider>;
};

export { ToastContext, ToastProvider };
