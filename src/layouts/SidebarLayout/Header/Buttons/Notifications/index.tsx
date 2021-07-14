import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Popover,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core';
import { useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import Link from '@material-ui/core/Link';
import { experimentalStyled } from '@material-ui/core/styles';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import CommentTwoToneIcon from '@material-ui/icons/CommentTwoTone';
import { useTranslation } from 'react-i18next';
import { formatDistance, subHours, subSeconds, subDays } from 'date-fns';

const AnimatedBadge = experimentalStyled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        box-shadow: 0 0 0 2px ${theme.palette.background.paper};
        background-color: #44b700;
        color: #44b700;
        
        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: ripple 1.2s infinite ease-in-out;
            border: 1px solid currentColor;
            content: "";
        }
    }
`
);

const NotificationsBadge = experimentalStyled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Tooltip arrow title={t('Notifications')}>
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={2}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
          <Typography variant="h5">{t('Notifications')}</Typography>
          <Link href="#" variant="caption" sx={{ textTransform: 'none' }}>
            {t('Mark all as read')}
          </Link>
        </Box>
        <Divider />
        <List sx={{ p: 2 }}>
          <ListItem
            sx={{ display: { xs: 'block', sm: 'flex' } }}
            button
            selected
          >
            <ListItemAvatar sx={{ mb: { xs: 1, sm: 0 } }}>
              <Avatar alt="James Dias" src="/static/images/avatars/1.jpg" />
            </ListItemAvatar>
            <Box flex="1">
              <Box
                display={{ xs: 'block', sm: 'flex' }}
                justifyContent="space-between"
              >
                <Typography sx={{ fontWeight: 'bold' }}>James Dias</Typography>
                <Typography variant="caption" sx={{ textTransform: 'none' }}>
                  {formatDistance(subSeconds(new Date(), 19), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: (theme: Theme) => theme.palette.error.main }}
              >
                {t('Missed call')}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                — I'll be in your neighborhood…
              </Typography>
            </Box>
          </ListItem>
          <Divider variant="inset" sx={{ my: 1 }} component="li" />
          <ListItem sx={{ display: { xs: 'block', sm: 'flex' } }} button>
            <ListItemAvatar sx={{ mb: { xs: 1, sm: 0 } }}>
              <AnimatedBadge
                overlap="circular"
                badgeContent=" "
                variant="dot"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <Avatar
                  alt="Randy Shepard"
                  src="/static/images/avatars/3.jpg"
                />
              </AnimatedBadge>
            </ListItemAvatar>
            <Box flex="1">
              <Box
                display={{ xs: 'block', sm: 'flex' }}
                justifyContent="space-between"
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  Randy Shepard
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'none' }}>
                  {formatDistance(subHours(new Date(), 3), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Typography component="span" variant="body2">
                {t('Created a new ticket')}:{' '}
                <Link href="#" variant="body2">
                  Header Bug Report
                </Link>
                .
              </Typography>
            </Box>
          </ListItem>
          <Divider variant="inset" sx={{ my: 1 }} component="li" />
          <ListItem
            sx={{ display: { xs: 'block', sm: 'flex' } }}
            alignItems="flex-start"
          >
            <ListItemAvatar sx={{ mb: { xs: 1, sm: 0 } }}>
              <Avatar alt="Sarah James" src="/static/images/avatars/2.jpg" />
            </ListItemAvatar>
            <Box flex="1">
              <Box
                display={{ xs: 'block', sm: 'flex' }}
                justifyContent="space-between"
              >
                <Typography sx={{ fontWeight: 'bold' }}>Sarah James</Typography>
                <Typography variant="caption" sx={{ textTransform: 'none' }}>
                  {formatDistance(subDays(new Date(), 1), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {t('Added some files to')}{' '}
                <Link href="#" variant="body2">
                  Marketing tasks
                </Link>{' '}
                {t('section')}.
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  mt: 2,
                  maxWidth: 400,
                  flexWrap: 'wrap',
                  display: 'flex',
                  background: (theme: Theme) => theme.colors.alpha.black[5]
                }}
              >
                <Box display={{ xs: 'block', md: 'flex' }} sx={{ p: 1 }}>
                  <DescriptionTwoToneIcon sx={{ mr: 0.5 }} />
                  <Box>
                    <Link href="#" variant="body2">
                      BalanceReports.pdf
                    </Link>
                    <Typography component="div" variant="caption">
                      187Kb
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" sx={{ p: 1 }}>
                  <DescriptionTwoToneIcon sx={{ mr: 0.5 }} />
                  <Box>
                    <Link href="#" variant="body2">
                      Income2022.pdf
                    </Link>
                    <Typography component="div" variant="caption">
                      187Kb
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </ListItem>
          <Divider variant="inset" sx={{ my: 1 }} component="li" />
          <ListItem sx={{ display: { xs: 'block', sm: 'flex' } }}>
            <ListItemAvatar sx={{ mb: { xs: 1, sm: 0 } }}>
              <Avatar
                sx={{
                  background: (theme: Theme) => theme.palette.success.main
                }}
              >
                <CommentTwoToneIcon />
              </Avatar>
            </ListItemAvatar>
            <Box flex="1">
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ fontWeight: 'bold' }}>
                  Messaging Platform
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'none' }}>
                  {formatDistance(subDays(new Date(), 3), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Typography component="span" variant="body2" fontWeight="bold">
                54
              </Typography>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {' '}
                {t('new messages in your inbox')}
              </Typography>
            </Box>
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="secondary" fullWidth>
            {t('View all notifications')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
