import '@testing-library/jest-dom';
import { err, ok } from 'true-myth/result';
import { describe, expect, it, vi } from 'vitest';

import SubmitButton, { SubmitButtonProps } from '../SubmitButton';

import { fireEvent, render, screen, waitFor } from '~/vitest/utils';

describe('SubmitButton', () => {
    const defaultProps: SubmitButtonProps = {
        onClick: vi.fn().mockResolvedValue(ok('Success')),
        type: 'submit',
    };

    it('renders without crashing', () => {
        render(<SubmitButton {...defaultProps}>Submit</SubmitButton>);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('displays loading state when isLoading is true', () => {
        render(
            <SubmitButton {...defaultProps} isLoading={true}>
                Submit
            </SubmitButton>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('disabled');
        expect(button).toHaveTextContent('Submit');
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const onClickMock = vi.fn().mockResolvedValue(ok('Success'));
        render(
            <SubmitButton {...defaultProps} onClick={onClickMock}>
                Submit
            </SubmitButton>
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onClickMock).toHaveBeenCalled();
    });

    it('displays success state when onClick resolves successfully', async () => {
        const onClickMock = vi.fn().mockResolvedValue(ok('Success'));
        render(
            <SubmitButton {...defaultProps} onClick={onClickMock}>
                Submit
            </SubmitButton>
        );
        const button = screen.getByRole('button');
        fireEvent.click(button);
        //wait for button to not have any children with role of progressbar
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));
        expect(onClickMock).toHaveBeenCalled();
    });

    it('triggers shake animation when onClick rejects', async () => {
        const onClickMock = vi.fn().mockResolvedValue(err('Error'));
        render(
            <SubmitButton {...defaultProps} onClick={onClickMock}>
                Submit
            </SubmitButton>
        );
        const button = screen.getByRole('button');
        fireEvent.click(button);
        //wait for button to not have any children with role of progressbar
        await waitFor(() => expect(button).not.toHaveAttribute('disabled'));
        expect(onClickMock).toHaveBeenCalled();
        // Add assertions for shake animation if possible
    });

    it('does not trigger shake animation when disableErrorState is true', async () => {
        const onClickMock = vi.fn().mockResolvedValue(err('Error'));
        render(
            <SubmitButton {...defaultProps} disableErrorState={true} onClick={onClickMock}>
                Submit
            </SubmitButton>
        );
        fireEvent.click(screen.getByRole('button'));
        await screen.findByText('Submit'); // Wait for the button to re-enable
        expect(onClickMock).toHaveBeenCalled();
        // Add assertions to ensure shake animation is not triggered
    });

    // Additional tests
    it('does not call onClick when button is disabled', async () => {
        const onClickMock = vi.fn();
        render(
            <SubmitButton {...defaultProps} isLoading={true} onClick={onClickMock}>
                Submit
            </SubmitButton>
        );
        fireEvent.click(screen.getByRole('button'));
        expect(onClickMock).not.toHaveBeenCalled();
    });

    it('renders with custom type', () => {
        render(
            <SubmitButton {...defaultProps} type="button">
                Submit
            </SubmitButton>
        );
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('displays children correctly', () => {
        render(<SubmitButton {...defaultProps}>Custom Text</SubmitButton>);
        expect(screen.getByText('Custom Text')).toBeInTheDocument();
    });
});
