import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DialogActions } from '@mui/material';

interface ResponsiveModalProps extends DialogProps {
    onCloseCallback?: () => void;
    closeDisabled?: boolean;
    actionChildren?: DialogProps['children'];
}

export default function Modal({ children, onCloseCallback, closeDisabled, actionChildren, ...rest }: ResponsiveModalProps) {
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
        <Dialog {...rest} fullScreen={fullScreen} onClose={onClose}>
            <DialogContent>{children}</DialogContent>
            {actionChildren && <DialogActions>{actionChildren}</DialogActions>}
        </Dialog>
    );
}
