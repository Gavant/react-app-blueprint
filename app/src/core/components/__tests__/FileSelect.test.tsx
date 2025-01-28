import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/vitest/utils';

import FileSelect from '~/core/components/FileSelect';
import { act } from 'react';
import useToast from '~/core/hooks/useToast';

vi.mock('~/core/hooks/useToast');

describe('FileSelect', () => {
    const mockOnChange = vi.fn();
    const error = vi.fn();
    const defaultProps = {
        id: 'file-upload',
        error: false,
        onChange: mockOnChange,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
        },
    };

    beforeEach(() => {
        vi.mocked(useToast).mockReturnValue({
            toast: { error, success: vi.fn(), info: vi.fn(), warning: vi.fn() },
            setToast: vi.fn(),
            toastMsg: { key: '1', msg: '', open: false, severity: 'info' },
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

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
        const data = mockData([file]);

        render(<FileSelect {...defaultProps} />);

        const dropzone = screen.getByRole('presentation');

        await act(() => fireEvent.drop(dropzone, data));

        expect(mockOnChange).toHaveBeenCalledWith([file]);
    });

    it('shows error state when invalid file is dropped', async () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const data = mockData([file]);

        render(<FileSelect {...defaultProps} />);

        const dropzone = screen.getByRole('presentation');
        await act(() => fireEvent.drop(dropzone, data));

        expect(error).toHaveBeenCalledWith('Invalid File Type');
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

function mockData(files: File[]) {
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
