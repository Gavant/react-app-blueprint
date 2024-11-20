// import { useTheme } from '@emotion/react';
import { Theme, useTheme, darken, lighten } from '@mui/material';
import { Sphere } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import styled from 'styled-components';
import { Color, Vector3 } from 'three';

import logo from '~/assets/images/logo.png';

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const Logo = styled(({ className }: { className?: string }) => (
    <div className={className}>
        <img src={logo as string} />
    </div>
))`
    position: absolute;
    right: 50px;
    top: 40px;
`;

const MIN_RADIUS = 1;
const MAX_RADIUS = 12;
const DEPTH = 2;
const NUM_POINTS = 1500;

const covertRgbToHex = (rgb: string) => {
    return rgb
        .match(/\d+/g)!
        .map((v) => parseInt(v).toString(16).padStart(2, '0'))
        .join('');
};

// https://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
const getGradientStop = (ratio: number, theme: Theme): Color => {
    // For outer ring numbers potentially past max radius,
    // just clamp to 0
    ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

    const c0 = `${covertRgbToHex(lighten(theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'dark'], 0.25))}`.match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * (1 - ratio));
    const c1 = `${covertRgbToHex(darken(theme.palette.primary[theme.palette.mode === 'dark' ? 'light' : 'dark'], 0.25))}`.match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * ratio);
    const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
    const color = ci
        .reduce((a, v) => (a << 8) + v, 0)
        .toString(16)
        .padStart(6, '0');

    return `#${color}` as unknown as Color;
};

const randomFromInterval = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

const calcColor = (x: number, theme: Theme) => {
    const maxDiff = MAX_RADIUS * 2;
    const distance = x + MAX_RADIUS;

    const ratio = distance / maxDiff;

    return getGradientStop(ratio, theme);
};

const pointsInner = (theme: Theme) =>
    Array.from(new Array(NUM_POINTS), (element, index) => index + 1).map((num) => {
        const randomRadius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
        const radomAngle = Math.random() * Math.PI * 2;
        const x = Math.cos(radomAngle) * randomRadius;
        const y = Math.sin(radomAngle) * randomRadius;
        const z = randomFromInterval(-DEPTH, DEPTH);

        const color = calcColor(x, theme);

        return {
            color,
            index: num,
            position: [x, y, z],
        };
    });

function Point({ color, position }: { color: Color; position: [number, number, number] }) {
    // random point between 0 and .5
    const randomNumber = Math.random() * 0.125;
    return (
        <Sphere args={[randomNumber, 10, 10]} position={position}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.5} />
        </Sphere>
    );
}

function Points() {
    const ref = useRef<any>();
    const theme = useTheme();
    useFrame(({ clock }) => {
        ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    });
    return (
        <group ref={ref}>
            {pointsInner(theme).map((point) => (
                <Point color={point.color} position={point.position} />
            ))}
        </group>
    );
}

function GSplash() {
    return (
        <Container className="relative">
            <Logo />
            <Canvas camera={{ position: [3, -7, -7] as Vector3 }} styles={{ height: '100vh' }}>
                <directionalLight />
                <pointLight position={[-30, 0, -30]} power={10.0} />
                <Points />
            </Canvas>
        </Container>
    );
}

export default GSplash;
