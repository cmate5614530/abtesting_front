import { Grid, Typography, Avatar } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';

function PageHeader() {
  const { t }: { t: any } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      {/* <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid> */}
      <Grid item>
        <Typography variant="h1" component="h1" gutterBottom>
          {t('Welcome')}, {user.name}!
        </Typography>
        <Typography variant="subtitle2">
          {t('These are your analytics stats for today')},{' '}
          <b>{format(new Date(), 'MMMM dd yyyy')}</b>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
