'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

const api = process.env.NEXT_PUBLIC_API_URL;

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();

  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Simula el login y obtiene datos de /me
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${api}/me`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setUser({ name: data.name, email: data.email });
        setError(null);
      } catch (err) {
        console.error("Error fetching /me:", err);
        setError("Could not load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        logger.error('Sign out error', error);
        return;
      }
      await checkSession?.();
      router.refresh();
    } catch (error) {
      logger.error('Sign out error', error);
    }
  }, [checkSession, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px' }}>
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={20} />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && user && (
          <>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.email}
            </Typography>
          </>
        )}
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.settings} onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
