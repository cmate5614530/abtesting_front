import {
  CardHeader,
  Divider,
  Card,
  LinearProgress,
  List,
  ListItem,
  Box,
  Typography
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';
import deFlag from 'country-flag-icons/3x2/DE.svg';
import usFlag from 'country-flag-icons/3x2/US.svg';
import esFlag from 'country-flag-icons/3x2/ES.svg';
import frFlag from 'country-flag-icons/3x2/FR.svg';
import cnFlag from 'country-flag-icons/3x2/CN.svg';

const ImageWrapper = experimentalStyled('img')(
  ({ theme }) => `
        margin-right: ${theme.spacing(1)};
        width: 36px;
`
);

const LinearProgressWrapper = experimentalStyled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        margin-right: ${theme.spacing(1)};
`
);

const ListItemWrapper = experimentalStyled(ListItem)(
  ({ theme }) => `
        border-radius: 0;
`
);

function SessionsByCountry() {
  const { t }: { t: any } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('Sessions by Country')} />
      <Divider />
      <List disablePadding component="nav">
        <ListItemWrapper sx={{ py: 3 }} button>
          <ImageWrapper alt="USA" src={usFlag} />
          <Typography
            variant="h5"
            color="text.primary"
            noWrap
            sx={{ minWidth: 80 }}
          >
            USA
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ ml: 1, flexGrow: 1 }}
          >
            <LinearProgressWrapper
              value={57}
              color="primary"
              variant="determinate"
            />
            <Typography variant="h4" color="text.primary">
              57%
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider />
        <ListItemWrapper sx={{ py: 3 }} button>
          <ImageWrapper alt="Germany" src={deFlag} />
          <Typography
            variant="h5"
            color="text.primary"
            noWrap
            sx={{ minWidth: 80 }}
          >
            Germany
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ ml: 1, flexGrow: 1 }}
          >
            <LinearProgressWrapper
              value={34}
              color="primary"
              variant="determinate"
            />
            <Typography variant="h4" color="text.primary">
              34%
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider />
        <ListItemWrapper sx={{ py: 3 }} button>
          <ImageWrapper alt="France" src={frFlag} />
          <Typography
            variant="h5"
            color="text.primary"
            noWrap
            sx={{ minWidth: 80 }}
          >
            France
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ ml: 1, flexGrow: 1 }}
          >
            <LinearProgressWrapper
              value={21}
              color="primary"
              variant="determinate"
            />
            <Typography variant="h4" color="text.primary">
              21%
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider />
        <ListItemWrapper sx={{ py: 3 }} button>
          <ImageWrapper alt="Spain" src={esFlag} />
          <Typography
            variant="h5"
            color="text.primary"
            noWrap
            sx={{ minWidth: 80 }}
          >
            Spain
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ ml: 1, flexGrow: 1 }}
          >
            <LinearProgressWrapper
              value={13}
              color="primary"
              variant="determinate"
            />
            <Typography variant="h4" color="text.primary">
              13%
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider />
        <ListItemWrapper sx={{ py: 3 }} button>
          <ImageWrapper alt="China" src={cnFlag} />
          <Typography
            variant="h5"
            color="text.primary"
            noWrap
            sx={{ minWidth: 80 }}
          >
            China
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ ml: 1, flexGrow: 1 }}
          >
            <LinearProgressWrapper
              value={71}
              color="primary"
              variant="determinate"
            />
            <Typography variant="h4" color="text.primary">
              71%
            </Typography>
          </Box>
        </ListItemWrapper>
        <Divider />
      </List>
    </Card>
  );
}

export default SessionsByCountry;
