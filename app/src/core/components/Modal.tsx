import { DialogActions, DialogTitle } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode } from 'react';

interface ResponsiveModalProps extends Omit<DialogProps, 'title'> {
    /**
     * Action children to be rendered in the modal
     *
     * @memberof ResponsiveModalProps
     */
    actions?: ReactNode;
    /**
     * Disables the close button on the modal
     *
     * @memberof ResponsiveModalProps
     */
    closeDisabled?: boolean;
    /**
     * Overrides the default fullscreen behavior of showing full screen based upon the theme breakpoints (md or less)
     *
     * @memberof ResponsiveModalProps
     */
    fullScreen?: boolean;
    /**
     * Callback function to be called when the modal is closed
     *
     * @memberof ResponsiveModalProps
     */
    onCloseCallback?: () => void;
    /**
     * Title of the modal
     *
     * @memberof ResponsiveModalProps
     */
    title?: ReactNode;
}

export default function Modal({ actions, children, closeDisabled, onCloseCallback, title, ...rest }: ResponsiveModalProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const onClose = () => {
        if (!closeDisabled) {
            if (onCloseCallback && typeof onCloseCallback === 'function') {
                onCloseCallback();
            }
        }
    };

    return (
        <Dialog fullScreen={fullScreen} {...rest} onClose={onClose}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
}
