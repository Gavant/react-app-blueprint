import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ok } from 'true-myth/result';
import { describe, expect, it, vi } from 'vitest';

import { renderWithTheme, resolveWithDelay } from '~/../vitest/utils';
import SubmitButton from '~/core/components/SubmitButton';

const onClickAction = vi.fn(() => {
    return resolveWithDelay(ok({}));
});

describe('Submit Button', () => {
    it('should render a button', () => {
        renderWithTheme(<SubmitButton type="button" />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('shows buttons spinner when clicked', async () => {
        renderWithTheme(<SubmitButton onClick={onClickAction} type="button" />);
        const button = screen.getByRole('button');

        act(() => {
            fireEvent.click(button);
        });

        const spinner = button.querySelector('.MuiLoadingButton-loadingIndicator');
        expect(spinner).toBeInTheDocument();
        await waitFor(() => expect(spinner).not.toBeInTheDocument());
    });

    it('can manually be controlled', async () => {
        let isLoading = true;
        const render = renderWithTheme(<SubmitButton isLoading={isLoading} onClick={onClickAction} type="button" />);
        const button = screen.getByRole('button');
        const spinner = button.querySelector('.MuiLoadingButton-loadingIndicator');
        expect(spinner).toBeInTheDocument();
        isLoading = false;
        render.rerender(<SubmitButton isLoading={isLoading} onClick={onClickAction} type="button" />);
        await waitFor(() => expect(spinner).not.toBeInTheDocument());
    });
});
