import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@material-ui/icons/ExpandMoreTwoTone';

import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Hidden,
  Menu,
  MenuItem,
  CardActions,
  Grid,
  Typography,
  Divider
} from '@material-ui/core';

import AudienceOverviewChart from './AudienceOverviewChart';
import AudienceOverviewSparklines from './AudienceOverviewSparklines';
import { experimentalStyled } from '@material-ui/core/styles';

const CardActionsWrapper = experimentalStyled(CardActions)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: 0;
      display: block;
`
);

const AudienceOverviewChartWrapper = experimentalStyled(AudienceOverviewChart)(
  ({ theme }) => `
        height: 200px;
`
);

const SparklinesChartWrapper = experimentalStyled(AudienceOverviewSparklines)(
  ({ theme }) => `
        height: 50px;
`
);

function AudienceOverview() {
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
  const audiences = [
    {
      value: 'users',
      text: t('Users')
    },
    {
      value: 'new_users',
      text: t('New users')
    },
    {
      value: 'page_views',
      text: t('Page views')
    },
    {
      value: 'avg_session_duration',
      text: t('Avg. session duration')
    },
    {
      value: 'bounce_rate',
      text: t('Bounce rate')
    },
    {
      value: 'sessions',
      text: t('Sessions')
    }
  ];

  const actionRef1 = useRef<any>(null);
  const actionRef2 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [openAudience, setOpenMenuAudience] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>(periods[3].text);
  const [audience, setAudience] = useState<string>(audiences[1].text);

  const data = {
    users: 14.586,
    newUsers: 12.847,
    pageViews: 67.492,
    avgSessionDuration: '00:05:21',
    bounceRate: '65.37%',
    sessions: 25.694
  };

  const newUsersAudience = {
    month: {
      data: [324, 315, 578, 576, 227, 459, 473, 282, 214, 623, 477, 401]
    }
  };

  const usersSparklines = {
    month: {
      data: [467, 696, 495, 477, 422, 585, 691, 294, 508, 304, 499, 390]
    }
  };
  const newUsersSparklines = {
    month: {
      data: [581, 203, 462, 518, 329, 395, 375, 447, 303, 423, 405, 589]
    }
  };
  const pageViewsSparklines = {
    month: {
      data: [353, 380, 325, 246, 682, 605, 672, 271, 386, 630, 577, 511]
    }
  };
  const avgSessionDurationSparklines = {
    month: {
      data: [508, 420, 336, 278, 627, 475, 575, 307, 441, 249, 413, 574]
    }
  };
  const bounceRateSparklines = {
    month: {
      data: [534, 345, 622, 332, 567, 250, 494, 270, 313, 470, 329, 287]
    }
  };
  const sessionsSparklines = {
    month: {
      data: [610, 234, 374, 423, 207, 507, 699, 304, 285, 257, 350, 227]
    }
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
        title={'Conversion Improvement Over Time'}
      />
      <Divider />
      <CardContent>
        <Button
          size="small"
          variant="outlined"
          ref={actionRef2}
          onClick={() => setOpenMenuAudience(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
        >
          {audience}
        </Button>
        <Menu
          anchorEl={actionRef2.current}
          onClose={() => setOpenMenuAudience(false)}
          open={openAudience}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {audiences.map((_audience) => (
            <MenuItem
              key={_audience.value}
              onClick={() => {
                setAudience(_audience.text);
                setOpenMenuAudience(false);
              }}
            >
              {_audience.text}
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ my: 3 }} height={200}>
          <AudienceOverviewChartWrapper
            data={newUsersAudience.month.data}
            labels={generic.month.labels}
          />
        </Box>
      </CardContent>
      <Divider />
      
    </Card>
  );
}

export default AudienceOverview;
