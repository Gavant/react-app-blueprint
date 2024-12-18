import { Alert, Slide, Snackbar } from '@mui/material';
import styled from 'styled-components';

import useToast from '~/core/hooks/useToast';

const InteractionlessSnackBar = styled(Snackbar)`
    pointer-events: none;
`;
function ToastBar() {
    const { setToast, toastMsg } = useToast();
    return (
        <InteractionlessSnackBar
            TransitionComponent={Slide}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            autoHideDuration={3000}
            disableWindowBlurListener
            key={toastMsg?.key}
            onClose={() =>
                setToast({
                    ...(toastMsg ?? { key: '', msg: '', severity: 'info' }),
                    open: false,
                })
            }
            open={toastMsg?.open}
        >
            <Alert severity={toastMsg?.severity}>{toastMsg?.msg}</Alert>
        </InteractionlessSnackBar>
    );
}

export default ToastBar;
