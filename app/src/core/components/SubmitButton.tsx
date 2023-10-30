import type { ButtonTypeMap } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { MouseEvent, PropsWithChildren } from 'react';
import { animated, useSpring } from 'react-spring';

import Result, { isOk, isErr } from 'true-myth/result';

const wobbleVolume = 5;
const AnimatedButton = animated(LoadingButton);

type MuiButtonProps = ButtonTypeMap['props'];
export interface SubmitButtonProps extends MuiButtonProps {
    disableErrorState?: boolean;
    disableSuccessState?: boolean; // TODO
    iconSize?: number;
    isLoading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement, Event>) => Promise<Result<any, any>>;
    type: 'submit';
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
            const result = await onClick(event);

            if (isOk(result) && !disableSuccessState) {
                console.log('TODO show success icon/animation');
            } else if (isErr(result) && !disableErrorState) {
                triggerShake();
            }
        }
    };

    return (
        <AnimatedButton
            disabled={isLoading}
            onClick={handleClick}
            loading={isLoading}
            variant="outlined"
            style={{ ...shakeProps }}
            {...rest}
        >
            {children}
        </AnimatedButton>
    );
}
