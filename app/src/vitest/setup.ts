import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

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

export default {};
