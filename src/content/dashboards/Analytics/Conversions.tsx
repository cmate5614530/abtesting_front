import { useTranslation } from 'react-i18next';
import {
  CardHeader,
  Divider,
  CardContent,
  Avatar,
  Card,
  ListItemText,
  List,
  ListItem
} from '@material-ui/core';
import Gauge from 'src/components/Gauge';
import { buildStyles } from 'react-circular-progressbar';
import TrendingDown from '@material-ui/icons/TrendingDown';
import TrendingUp from '@material-ui/icons/TrendingUp';
import TrendingFlat from '@material-ui/icons/TrendingFlat';
import { experimentalStyled } from '@material-ui/core/styles';

const AvatarWrapperError = experimentalStyled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
`
);

const AvatarWrapperSuccess = experimentalStyled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);

const AvatarWrapperWarning = experimentalStyled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color:  ${theme.colors.warning.main};
`
);

function Conversions() {
  const { t }: { t: any } = useTranslation();

  const data = {
    percentage: 67,
    sales: 127,
    customers: 1.358,
    earnings: '$15,864.00'
  };

  return (
    <Card>
      <CardHeader title={t('Conversions')} />
      <Divider />
      <CardContent>
        <Gauge
          circleRatio={0.65}
          styles={buildStyles({ rotation: 1 / 2 + 1 / 5.7 })}
          value={data.percentage}
          strokeWidth={13}
          text={`${data.percentage}%`}
          color="primary"
          size="xxlarge"
        ></Gauge>

        <List disablePadding dense>
          <ListItem>
            <ListItemText
              primary={t('Sales Today')}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.sales}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary',
                noWrap: true
              }}
            />
            <AvatarWrapperError>
              <TrendingDown fontSize="medium" />
            </AvatarWrapperError>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem>
            <ListItemText
              primary={t('Customers per month')}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.customers}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary'
              }}
            />
            <AvatarWrapperWarning>
              <TrendingFlat fontSize="medium" />
            </AvatarWrapperWarning>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem>
            <ListItemText
              primary={t('Earnings Report')}
              primaryTypographyProps={{
                variant: 'subtitle2',
                gutterBottom: true,
                noWrap: true
              }}
              secondary={data.earnings}
              secondaryTypographyProps={{
                variant: 'h3',
                color: 'textPrimary'
              }}
            />
            <AvatarWrapperSuccess>
              <TrendingUp fontSize="medium" />
            </AvatarWrapperSuccess>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default Conversions;
