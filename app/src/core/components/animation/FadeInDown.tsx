import { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';

export interface FadeElementInDownProps {
    children: ReactNode;
    offset: number;
}

function FadeElementInDown({ children, offset }: FadeElementInDownProps) {
    const fadeInMove = useSpring({
        from: { opacity: 0, transform: `translateY(-${offset}rem)` },
        opacity: 1,
        transform: `translateY(0)`,
    });

    return <animated.div style={fadeInMove}>{children}</animated.div>;
}

export default FadeElementInDown;
