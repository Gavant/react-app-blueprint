import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonTypeMap } from '@mui/material';
import { MouseEvent, PropsWithChildren, useCallback, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import Result, { isErr, isOk } from 'true-myth/result';

const wobbleVolume = 5;
const AnimatedButton = animated(LoadingButton);

type MuiButtonProps = ButtonTypeMap['props'];
export interface SubmitButtonProps extends MuiButtonProps {
    disableErrorState?: boolean;
    disableSuccessState?: boolean; // TODO
    iconSize?: number;
    isLoading?: boolean;
    onClick?: (event: MouseEvent<HTMLButtonElement, Event>) => Promise<Result<unknown, unknown>>;
    type: 'button' | 'submit';
}

export default function SubmitButton({
    children,
    disableErrorState,
    disableSuccessState,
    iconSize,
    isLoading,
    onClick,
    type = 'submit',
    ...rest
}: PropsWithChildren<SubmitButtonProps>) {
    const [isSubmitResolving, setIsSubmitResolving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const isButtonLoading = isSubmitResolving || isLoading;

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

    const successState = useCallback(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleClick = async (event: MouseEvent<HTMLButtonElement, Event>) => {
        if (onClick) {
            setIsSubmitResolving(true);
            const result = await onClick(event);

            if (isOk(result) && !disableSuccessState) {
                setShowSuccess(true);
                successState();
            } else if (isErr(result) && !disableErrorState) {
                triggerShake();
            }
            setIsSubmitResolving(false);
        }
    };

    return (
        <AnimatedButton
            disabled={isButtonLoading}
            loading={isButtonLoading}
            onClick={handleClick}
            style={{ ...shakeProps }}
            type={type}
            {...rest}
        >
            {/* There is a known issue with translating a page using Chrome tools when a Loading Button is present. 
            After the page is translated, the application crashes when the loading state of a Button changes. 
            To prevent this, ensure that the contents of the Loading Button are nested inside any HTML element, such as a <span> */}
            {showSuccess ? <CheckCircleIcon /> : <span>{children}</span>}
        </AnimatedButton>
    );
}
