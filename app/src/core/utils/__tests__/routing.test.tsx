import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react'; // Adjust the import path as needed
import { describe, expect, it, vi } from 'vitest';

import { Authenticate, Suspense } from '~/core/utils/routing';

vi.mock('react-auth-kit', async () => {
    return {
        RequireAuth: ({ children }: { children: any }) => <div data-testid="require-auth">{children}</div>,
    };
});

describe('Suspense', () => {
    it('renders the provided element', () => {
        const childElement: ReactElement = <div>Test Element</div>;

        const { getByText } = render(Suspense(childElement));

        // Ensure that the provided element is rendered
        expect(getByText('Test Element')).toBeInTheDocument();
    });

    // TODO: Mock suspense + show circular progress?
});

describe('Authenticate', () => {
    it('renders the provided element', () => {
        const childElement = <div>Test Element</div>;

        const { getByText } = render(Authenticate(childElement));

        // Ensure that the provided element is rendered
        expect(getByText('Test Element')).toBeInTheDocument();
        expect(screen.getByTestId('require-auth')).toBeInTheDocument();
    });
});
