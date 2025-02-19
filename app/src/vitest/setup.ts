import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import 'vitest-axe/extend-expect';
import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

expect.extend(matchers);

/* @ts-ignore */
HTMLCanvasElement.prototype.getContext = () => {
    return {
        fillRect: vi.fn(),
        fillStyle: '',
    };
};

process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.log('FAILED TO HANDLE PROMISE REJECTION');
    throw reason;
});

declare module 'vitest' {
    export interface Assertion extends AxeMatchers {}
    export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

export default {};
