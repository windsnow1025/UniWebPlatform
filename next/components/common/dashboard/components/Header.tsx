import Stack from '@mui/material/Stack';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import AnnouncementBell from '../../components/AnnouncementBell';

import Search from './Search';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <div />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <AnnouncementBell />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
