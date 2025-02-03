import { Skeleton, Theme, Typography } from '@mui/material';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';
import { useTheme } from '@mui/material/styles';
import { CSSProperties, TypographyStyle, Variant } from '@mui/material/styles/createTypography';
import { SxProps } from '@mui/system';
import { OverridableStringUnion } from '@mui/types';

export interface SkeletonTextProps {
    className?: string;
    skeletonFontSize?: TypographyStyle;
    sx?: SxProps<Theme>;
    typographyVariant: OverridableStringUnion<'inherit' | Variant, TypographyPropsVariantOverrides>;
    value: number | string | undefined;
}

export default function SkeletonText({ className, skeletonFontSize, sx, typographyVariant, value }: SkeletonTextProps) {
    const theme = useTheme();
    return value ? (
        <Typography className={className} data-testid="text" sx={{ ...sx }} variant={typographyVariant}>
            {value}
        </Typography>
    ) : (
        <Skeleton
            className={className}
            data-testid="skeleton"
            sx={{
                fontSize: skeletonFontSize ?? theme.typography[typographyVariant as keyof typeof theme.typography],
                ...sx,
            }}
            variant="text"
        />
    );
}
