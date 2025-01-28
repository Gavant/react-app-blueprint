import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/vitest/utils';

import userEvent from '@testing-library/user-event';
import FileSelect from '~/core/components/FileSelect';

vi.mock('~/core/hooks/useToast', () => ({
    default: () => ({ toast: { error: vi.fn() } }),
}));

describe('FileSelect', () => {
    const mockOnChange = vi.fn();

    const defaultProps = {
        id: 'file-upload',
        error: false,
        onChange: mockOnChange,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
        },
    };

    it('renders the FileSelect component with children', () => {
        render(
            <FileSelect {...defaultProps}>
                <div>Drop files here</div>
            </FileSelect>
        );

        expect(screen.getByText('Drop files here')).toBeInTheDocument();
    });

    it('handles file drop correctly', async () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        render(<FileSelect {...defaultProps} />);

        const dropzone = screen.getByRole('presentation');

        const event = createDragEvent([file]);
        await userEvent.upload(dropzone, file);

        expect(mockOnChange).toHaveBeenCalledWith([file]);
    });

    it('shows error state when invalid file is dropped', async () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const toast = vi.fn();
        // vi.mock('~/core/hooks/useToast', () => ({
        //     default: () => ({
        //         toast: { error: toast },
        //     }),
        // }));

        render(<FileSelect {...defaultProps} />);

        const dropzone = screen.getByRole('presentation');
        await userEvent.upload(dropzone, file);

        expect(toast).toHaveBeenCalledWith('Invalid File Type');
    });

    it('renders with error state', () => {
        render(
            <FileSelect {...defaultProps} error={true}>
                <div>Drop files here</div>
            </FileSelect>
        );

        const container = screen.getByRole('presentation');
        expect(container).toHaveStyle({ borderColor: expect.stringContaining('error') });
    });
});

function createDragEvent(files: File[]) {
    return {
        dataTransfer: {
            files,
            items: files.map((file) => ({
                kind: 'file',
                type: file.type,
                getAsFile: () => file,
            })),
            types: ['Files'],
        },
    };
}
