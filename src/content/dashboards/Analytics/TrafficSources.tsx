import { useRef, useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';

import Divider from '@material-ui/core/Divider';
import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  Hidden,
  Tabs,
  Tab
} from '@material-ui/core';

import TrafficSourcesChart from './TrafficSourcesChart';
import { experimentalStyled } from '@material-ui/core/styles';

const CardActionsWrapper = experimentalStyled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

const TrafficSourcesChartWrapper = experimentalStyled(TrafficSourcesChart)(
  ({ theme }) => `
        height: 250px;
`
);

const TabsContainerWrapper = experimentalStyled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const EmptyResultsWrapper = experimentalStyled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

function TrafficSources() {
  const { t }: { t: any } = useTranslation();

  const periods = [
    {
      value: 'today',
      text: t('Today')
    },
    {
      value: 'yesterday',
      text: t('Yesterday')
    },
    {
      value: 'last_month',
      text: t('Last month')
    },
    {
      value: 'last_year',
      text: t('Last year')
    }
  ];

  const data = {
    users: 2.593,
    pagesSession: 2.66,
    newSessions: '82.05%',
    avgSessionDuration: '00:03:56',
    bounceRate: '49.75%',
    sessions: 9.381
  };

  const referrals = {
    current: [1008, 940, 1010, 821, 1035, 1030, 957, 926, 993, 1021, 997, 879],
    previous: [648, 745, 897, 743, 635, 842, 811, 696, 878, 987, 747, 731]
  };

  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>('Select period');

  const [currentTab, setCurrentTab] = useState<string>('referral');

  const tabs = [
    { value: 'direct', label: t('Direct') },
    { value: 'referral', label: t('Referral') },
    { value: 'organic', label: t('Organic') },
    { value: 'social', label: t('Social') }
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const generic = {
    month: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    }
  };

  return (
    <Card>
      <CardHeader
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
            <Menu
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuPeriod(false)}
              open={openPeriod}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {periods.map((_period) => (
                <MenuItem
                  key={_period.value}
                  onClick={() => {
                    setPeriod(_period.text);
                    setOpenMenuPeriod(false);
                  }}
                >
                  {_period.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        }
        title={t('Traffic Sources')}
      />
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Hidden smDown>
        <Divider />
      </Hidden>
      <CardContent sx={{ p: { xs: 0, sm: 3 } }}>
        <Box sx={{ mt: { xs: 0, sm: 3 } }}>
          {currentTab === 'direct' && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />
              <Typography
                align="center"
                variant="h2"
                fontWeight="normal"
                color="text.secondary"
                sx={{ mt: 3 }}
                gutterBottom
              >
                There are no charts generated for <b>Direct</b> traffic sources!
              </Typography>
              <Button variant="contained" sx={{ mt: 4 }}>
                Generate Chart
              </Button>
            </Box>
          )}
          {currentTab === 'referral' && (
            <Hidden smDown>
              <Box height={250} sx={{ px: { lg: 6 } }}>
                <TrafficSourcesChartWrapper
                  data={referrals}
                  labels={generic.month.labels}
                />
              </Box>
            </Hidden>
          )}
          {currentTab === 'organic' && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

              <Typography
                align="center"
                variant="h2"
                fontWeight="normal"
                color="text.secondary"
                sx={{ mt: 3 }}
                gutterBottom
              >
                There are no charts generated for <b>Organic</b> traffic
                sources!
              </Typography>
              <Button variant="contained" sx={{ mt: 4 }}>
                Generate Chart
              </Button>
            </Box>
          )}
          {currentTab === 'social' && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

              <Typography
                align="center"
                variant="h2"
                fontWeight="normal"
                color="text.secondary"
                sx={{ mt: 3 }}
                gutterBottom
              >
                There are no charts generated for <b>Social</b> traffic sources!
              </Typography>
              <Button variant="contained" sx={{ mt: 4 }}>
                Generate Chart
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
      <Divider />
      <CardActionsWrapper>
        <Box>
          <Grid container alignItems="center">
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.users}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('Users')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.sessions}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('Sessions')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.pagesSession}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('pages/session')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.avgSessionDuration}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('Avg. Session Duration')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.newSessions}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('% New Sessions')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
            <Grid xs={12} sm={6} md={4} item sx={{ position: 'relative' }}>
              <Hidden smDown>
                <Divider orientation="vertical" flexItem absolute />
              </Hidden>
              <Box sx={{ p: 3 }}>
                <Box>
                  <Typography align="center" variant="h3" gutterBottom>
                    {data.bounceRate}
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    {t('Bounce Rate')}
                  </Typography>
                </Box>
              </Box>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </CardActionsWrapper>
    </Card>
  );
}

export default TrafficSources;
