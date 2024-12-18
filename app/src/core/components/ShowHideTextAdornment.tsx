import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, IconButtonProps, InputAdornment, InputAdornmentProps } from '@mui/material';

interface AdornmentProps extends Omit<InputAdornmentProps, 'position'> {
    IconButtonProps?: IconButtonProps;
    change: () => void;
    visible: boolean;
}

function ShowHideTextAdornment({ IconButtonProps, change, visible, ...rest }: AdornmentProps) {
    return (
        <InputAdornment {...rest} position="end">
            <IconButton {...IconButtonProps} aria-label="toggle password visibility" edge="end" onClick={change} onMouseDown={change}>
                {visible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
        </InputAdornment>
    );
}

export default ShowHideTextAdornment;
