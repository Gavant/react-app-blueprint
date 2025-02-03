import { beforeEach, describe, expect, it, vi } from 'vitest';

import FileList, { FileWithProgress } from '../FileList';

import { render, screen } from '~/vitest/utils';

describe('FileList', () => {
    beforeEach(() => {
        global.URL.createObjectURL = vi.fn(() => 'blob:image-url');
    });

    it('renders an image file correctly', () => {
        const fileImage = new File(['dummy content'], 'photo.png', { type: 'image/png' });
        const fileWithProgress: FileWithProgress = { file: fileImage, progress: 50 };

        render(<FileList files={[fileWithProgress]} />);

        // Should render the image with the correct alt and src attributes
        const image = screen.getByAltText('photo.png') as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain('blob:image-url');

        // Verify progress percentage text is shown
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders a non-image file with file icon', () => {
        const fileDoc = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
        const fileWithProgress: FileWithProgress = { file: fileDoc, progress: 75 };

        render(<FileList files={[fileWithProgress]} />);

        // Since the file is not an image, the FileListIcon should be rendered.
        // The file name must be present.
        expect(screen.getByText('document.pdf')).toBeInTheDocument();
        // Verify progress percentage text is shown
        expect(screen.getByText('75%')).toBeInTheDocument();

        // Check for presence of an SVG element rendered by the InsertDriveFile icon.
        const svgIcon = screen.getByRole('img', { hidden: true });
        expect(svgIcon).toBeInTheDocument();
    });

    it('renders multiple files correctly', () => {
        const fileImage = new File(['image data'], 'image.jpg', { type: 'image/jpeg' });
        const fileDoc = new File(['pdf data'], 'report.pdf', { type: 'application/pdf' });
        const files: FileWithProgress[] = [
            { file: fileImage, progress: 30 },
            { file: fileDoc, progress: 90 },
        ];

        render(<FileList files={files} />);

        // Image file
        const image = screen.getByAltText('image.jpg') as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain('blob:image-url');
        expect(screen.getByText('30%')).toBeInTheDocument();

        // Non-image file should show its name and progress
        expect(screen.getByText('report.pdf')).toBeInTheDocument();
        expect(screen.getByText('90%')).toBeInTheDocument();
    });
});
