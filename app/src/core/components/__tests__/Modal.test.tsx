import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/vitest/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import Modal from '~/core/components/Modal';

vi.mock('@mui/material/useMediaQuery');

describe('Modal', () => {
    it('renders children content', () => {
        render(
            <Modal open>
                <div>Test Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders action children when provided', () => {
        render(
            <Modal open actions={<button>Action Button</button>}>
                <div>Test Content</div>
            </Modal>
        );
        expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('calls onCloseCallback when dialog is closed', () => {
        const onCloseCallback = vi.fn();
        render(
            <Modal open onCloseCallback={onCloseCallback} data-testid="test-backdrop">
                <div>Test Content</div>
            </Modal>
        );

        const backdrop = screen.getByTestId('test-backdrop').firstChild;
        backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(onCloseCallback).toHaveBeenCalled();
    });

    it('does not call onCloseCallback when closeDisabled is true', () => {
        const onCloseCallback = vi.fn();
        render(
            <Modal open onCloseCallback={onCloseCallback} closeDisabled data-testid="test-backdrop">
                <div>Test Content</div>
            </Modal>
        );

        const backdrop = screen.getByTestId('test-backdrop').firstChild;
        backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(onCloseCallback).not.toHaveBeenCalled();
    });

    it('renders in fullScreen mode on small screens by default', () => {
        vi.mocked(useMediaQuery).mockReturnValue(true);

        render(
            <Modal open>
                <div>Test Content</div>
            </Modal>
        );

        expect(document.querySelector('.MuiDialog-paperFullScreen')).toBeInTheDocument();
    });

    it('renders in normal mode on large screens by default', () => {
        vi.mocked(useMediaQuery).mockReturnValue(false);

        render(
            <Modal open>
                <div>Test Content</div>
            </Modal>
        );

        expect(document.querySelector('.MuiDialog-paperFullScreen')).not.toBeInTheDocument();
    });

    it('renders in fullScreen mode when fullScreen prop is passed in as true', () => {
        render(
            <Modal open fullScreen>
                <div>Test Content</div>
            </Modal>
        );

        expect(document.querySelector('.MuiDialog-paperFullScreen')).toBeInTheDocument();
    });

    it('does not render in fullScreen mode when fullScreen prop is passed in as false', () => {
        render(
            <Modal open fullScreen={false}>
                <div>Test Content</div>
            </Modal>
        );

        expect(document.querySelector('.MuiDialog-paperFullScreen')).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
        render(
            <Modal open title="Test Title">
                <div>Test Content</div>
            </Modal>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
});
