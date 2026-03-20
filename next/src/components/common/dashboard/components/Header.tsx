import Stack from '@mui/material/Stack';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Brand from '@/components/common/components/Brand';
import AnnouncementBell from '@/components/common/components/AnnouncementBell';

import Search from './Search';

export default function Header({ collapsed = false }: { collapsed?: boolean }) {
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
      {collapsed ? <Brand /> : <div />}
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <AnnouncementBell />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
