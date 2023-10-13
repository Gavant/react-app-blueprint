import { ReactNode } from 'react';
import { animated, useSpring } from 'react-spring';

function FadeElementInDown({ children, offset }: { children: ReactNode; offset: number }) {
    const fadeInMove = useSpring({
        from: { opacity: 0, transform: `translateY(-${offset}rem)` },
        opacity: 1,
        transform: `translateY(0)`,
    });

    return <animated.div style={fadeInMove}>{children}</animated.div>;
}

export default FadeElementInDown;
