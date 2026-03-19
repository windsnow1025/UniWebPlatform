import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PasswordIcon from '@mui/icons-material/Password';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, href: '/' },
  { text: 'AI Studio', icon: <AutoAwesomeIcon />, href: '/ai' },
  { text: 'Crypto', icon: <PasswordIcon />, href: '/password' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, href: '/settings' },
];

export default function MenuContent() {
  const pathname = usePathname();

  const isSelected = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} href={item.href} selected={isSelected(item.href)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} href={item.href} selected={isSelected(item.href)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
