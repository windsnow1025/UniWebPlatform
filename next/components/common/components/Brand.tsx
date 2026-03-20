import Typography, { TypographyProps } from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Brand({ variant = 'h5' }: { variant?: TypographyProps['variant'] }) {
  return (
    <div className="flex-center-nowrap gap-2">
      <AutoAwesomeIcon color="primary" />
      <Typography variant={variant} noWrap>
        PolyFlexLLM
      </Typography>
    </div>
  );
}
