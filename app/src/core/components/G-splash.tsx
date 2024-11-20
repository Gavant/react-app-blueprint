import React, { useRef } from 'react';
import styled from 'styled-components';
import { Sphere, OrbitControls, DragControls } from '@react-three/drei';
import { Canvas, GroupProps, useFrame, useThree } from '@react-three/fiber';
import { Color, Vector3, MathUtils } from 'three';
import logo from '~/assets/images/logo.png'

const Container = styled.div`
    height: 100%;
    width: 100%;
`

const Logo = styled(({ className }) => <div className={className}><img src={logo as string} /></div>)`
    position: absolute;
    right: 50px;
    top: 40px;
`

const MIN_RADIUS = 5.5;
const MAX_RADIUS = 12;
const DEPTH = 4;
const LEFT_COLOR = "090979"
const RIGHT_COLOR = "00d4ff"
const NUM_POINTS = 2500

// https://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
const getGradientStop = (ratio): Color => {
    // For outer ring numbers potentially past max radius,
    // just clamp to 0
    ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

    const c0 = LEFT_COLOR.match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * (1 - ratio));
    const c1 = RIGHT_COLOR.match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * ratio);
    const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
    const color = ci.reduce((a, v) => (a << 8) + v, 0).toString(16).padStart(6, "0");

    return `#${color}` as Color;
};

const randomFromInterval = (min, max) => {
    return Math.random() * (max - min) + min;
}

const calcColor = (x) => {
    const maxDiff = MAX_RADIUS * 2;
    const distance = x + MAX_RADIUS;

    const ratio = distance / maxDiff;

    return getGradientStop(ratio);
}

const pointsInner = Array.from(new Array(NUM_POINTS), (element,index) => index + 1).map((num) => {
    const randomRadius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
    const radomAngle = Math.random() * Math.PI * 2;
    const x = Math.cos(radomAngle) * randomRadius;
    const y = Math.sin(radomAngle) * randomRadius;
    const z = randomFromInterval(-DEPTH, DEPTH);

    const color = calcColor(x);

    return {
        index: num,
        position: [x,y,z],
        color
    }
})

function Point({ position, color }: { position: [number, number, number], color: Color }) {
    return (
        <Sphere position={position} args={[0.1, 10, 10]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.5}/>
        </Sphere>
    )
}

function Points() {
    const ref = useRef<any>();
    useFrame(({ clock }) => { ref.current.rotation.z = clock.getElapsedTime() * 0.05; });
    return (
        <group ref={ref}>
            {pointsInner.map((point) => <Point position={point.position} color={point.color} />)}
        </group>
    )
}

function GSplash() {

    return (<Container className="relative">
        <Logo />
        <Canvas camera={{ position: [3, -7, -7] as Vector3}} styles={{ height: '100vh' }}>
            <directionalLight />
            <pointLight position={[-30, 0, -30]} power={10.0}/>
            <Points />
        </Canvas>
    </Container>)
}

export default GSplash