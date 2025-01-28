import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DialogActions } from '@mui/material';

interface ResponsiveModalProps extends DialogProps {
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
    actionChildren?: DialogProps['children'];
    /**
     * Overrides the default fullscreen behavior of showing full screen based upon the theme breakpoints (md or less)
     *
     * @memberof ResponsiveModalProps
     */
    fullScreen?: boolean;
}

export default function Modal({ children, onCloseCallback, closeDisabled, actionChildren, fullScreen, ...rest }: ResponsiveModalProps) {
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
            <DialogContent>{children}</DialogContent>
            {actionChildren && <DialogActions>{actionChildren}</DialogActions>}
        </Dialog>
    );
}
