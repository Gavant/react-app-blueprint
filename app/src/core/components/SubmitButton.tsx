import { Button, ButtonTypeMap, CircularProgress, ExtendButtonBase } from '@mui/material';
import { MouseEvent, PropsWithChildren } from 'react';
import { animated, useSpring } from 'react-spring';

const wobbleVolume = 5;
const AnimatedButton = animated(Button);

export interface SubmitButtonProps extends ExtendButtonBase<ButtonTypeMap<{}, 'button'>> {
    disableErrorState?: boolean;
    disableSuccessState?: boolean; // TODO
    iconSize?: number;
    isLoading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement, Event>) => Promise<unknown>;
}

export default function SubmitButton({
    children,
    disableErrorState,
    disableSuccessState,
    iconSize,
    isLoading,
    onClick,
    ...rest
}: PropsWithChildren<SubmitButtonProps>) {
    // TODO default the size based on the Button.size prop
    const progressSize = iconSize ?? 26;

    const [shakeProps, shakeApi] = useSpring(() => ({
        from: { x: 0 },
    }));

    const triggerShake = () =>
        shakeApi.start({
            config: {
                duration: 75,
            },
            to: [{ x: -wobbleVolume }, { x: wobbleVolume }, { x: -wobbleVolume }, { x: wobbleVolume }, { x: 0 }],
        });

    const handleClick = async (event: MouseEvent<HTMLButtonElement, Event>) => {
        if (onClick) {
            try {
                await onClick(event);

                if (!disableSuccessState) {
                    console.log('TODO show success icon/animation');
                }
            } catch (error) {
                if (!disableErrorState) {
                    triggerShake();
                }
            }
        }
    };

    return (
        <AnimatedButton disabled={isLoading} onClick={handleClick} style={{ ...shakeProps }} {...rest}>
            {isLoading ? <CircularProgress size={progressSize} /> : children}
        </AnimatedButton>
    );
}
