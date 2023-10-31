import type { ButtonTypeMap } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { MouseEvent, PropsWithChildren, useState } from 'react';
import { animated, useSpring } from 'react-spring';

import Result, { isOk, isErr } from 'true-myth/result';

const wobbleVolume = 5;
const AnimatedButton = animated(LoadingButton);

type MuiButtonProps = ButtonTypeMap['props'];
export interface SubmitButtonProps extends MuiButtonProps {
    disableErrorState?: boolean;
    disableSuccessState?: boolean; // TODO
    iconSize?: number;
    onClick?: (event: MouseEvent<HTMLButtonElement, Event>) => Promise<Result<unknown, unknown>>;
    type: 'button' | 'submit';
}

export default function SubmitButton({
    children,
    disableErrorState,
    disableSuccessState,
    iconSize,
    type = 'submit',
    onClick,
    ...rest
}: PropsWithChildren<SubmitButtonProps>) {
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            const result = await onClick(event);

            if (isOk(result) && !disableSuccessState) {
                console.log('TODO show success icon/animation');
            } else if (isErr(result) && !disableErrorState) {
                triggerShake();
            }
            setIsLoading(false);
        }
    };

    return (
        <AnimatedButton
            disabled={isLoading}
            onClick={handleClick}
            loading={isLoading}
            variant="outlined"
            style={{ ...shakeProps }}
            type={type}
            {...rest}
        >
            {/* There is a known issue with translating a page using Chrome tools when a Loading Button is present. 
            After the page is translated, the application crashes when the loading state of a Button changes. 
            To prevent this, ensure that the contents of the Loading Button are nested inside any HTML element, such as a <span> */}
            <span>{children}</span>
        </AnimatedButton>
    );
}
