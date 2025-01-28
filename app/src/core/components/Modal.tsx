import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DialogActions, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';

interface ResponsiveModalProps extends Omit<DialogProps, 'title'> {
    /**
     * Callback function to be called when the modal is closed
     *
     * @memberof ResponsiveModalProps
     */
    onCloseCallback?: () => void;
    /**
     * Disables the close button on the modal
     *
     * @memberof ResponsiveModalProps
     */
    closeDisabled?: boolean;
    /**
     * Action children to be rendered in the modal
     *
     * @memberof ResponsiveModalProps
     */
    actions?: ReactNode;
    /**
     * Overrides the default fullscreen behavior of showing full screen based upon the theme breakpoints (md or less)
     *
     * @memberof ResponsiveModalProps
     */
    fullScreen?: boolean;
    /**
     * Title of the modal
     *
     * @memberof ResponsiveModalProps
     */
    title?: ReactNode;
}

export default function Modal({ title, children, onCloseCallback, closeDisabled, actions, fullScreen, ...rest }: ResponsiveModalProps) {
    const theme = useTheme();
    const isFullScreen = fullScreen ?? useMediaQuery(theme.breakpoints.down('md'));

    const onClose = () => {
        if (!closeDisabled) {
            if (onCloseCallback && typeof onCloseCallback === 'function') {
                onCloseCallback();
            }
        }
    };

    return (
        <Dialog {...rest} fullScreen={isFullScreen} onClose={onClose}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
}
