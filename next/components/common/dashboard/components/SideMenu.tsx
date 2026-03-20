import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brand from '../../components/Brand';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { useSession } from '@/components/common/session/SessionContext';

const expandedWidth = 240;
const collapsedWidth = 56;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed?: boolean }>(({ collapsed }) => ({
  width: collapsed ? collapsedWidth : expandedWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  transition: 'width 0.2s',
  [`& .${drawerClasses.paper}`]: {
    width: collapsed ? collapsedWidth : expandedWidth,
    boxSizing: 'border-box',
    transition: 'width 0.2s',
    overflowX: 'hidden',
  },
}));

export default function SideMenu({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const session = useSession();

  return (
    <Drawer
      variant="permanent"
      collapsed={collapsed}
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          overflow: 'hidden',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
          minHeight: 56,
        }}
      >
        {!collapsed && (
          <Brand />
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton size="small" onClick={onToggle}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent collapsed={collapsed} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          ...(collapsed && { justifyContent: 'center' }),
          borderTop: '1px solid',
          borderColor: 'divider',
          minHeight: 68,
        }}
      >
        {collapsed ? (
          <OptionsMenu trigger={
            <Avatar
              sizes="small"
              alt={session?.user?.name ?? ''}
              src={session?.user?.image ?? undefined}
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
            />
          } />
        ) : (
          <>
            <Avatar
              sizes="small"
              alt={session?.user?.name ?? ''}
              src={session?.user?.image ?? undefined}
              sx={{ width: 36, height: 36 }}
            />
            <Box sx={{ mr: 'auto', overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }} noWrap>
                {session?.user?.name ?? 'Guest'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {session?.user?.email ?? ''}
              </Typography>
            </Box>
            <OptionsMenu />
          </>
        )}
      </Stack>
    </Drawer>
  );
}
