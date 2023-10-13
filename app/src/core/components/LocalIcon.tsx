import { Icon } from '@mui/material';
import styled from 'styled-components';

const IconRoot = styled(Icon)`
    text-align: center;
`;

const Img = styled.img<{ $invert?: boolean }>`
    display: flex;
    height: inherit;
    width: inherit;
    filter: ${({ $invert, theme }) =>
        `invert(${$invert ? Number(theme.palette.mode === 'light') : Number(theme.palette.mode !== 'light')})`};
`;

export interface LocalIconProps {
    className?: string;
    invert?: boolean;
    src: string;
}

export default function LocalIcon({ className, invert, src }: LocalIconProps) {
    return (
        <IconRoot className={className}>
            <Img $invert={invert} src={src} style={{ fill: 'white' }} />
        </IconRoot>
    );
}
