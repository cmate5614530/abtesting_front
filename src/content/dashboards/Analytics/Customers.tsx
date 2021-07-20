import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';
import HelpOutlineTwoToneIcon from '@material-ui/icons/HelpOutlineTwoTone';
import Label from 'src/components/Label';
import ArrowDownwardTwoTone from '@material-ui/icons/ArrowDownwardTwoTone';

const ArrowDownwardWrapper = experimentalStyled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
);
function Customers() {
  const { t }: { t: any } = useTranslation();

  const data = {
    value: '347'
  };

  return (
    <Card sx={{ px: 1, pt: 1 }}>
      <CardHeader
        sx={{ pb: 0 }}
        titleTypographyProps={{
          variant: 'subtitle2',
          fontWeight: 'bold',
          color: 'textSecondary'
        }}
        action={
          <Tooltip
            placement="top"
            arrow
            title={t('This section can have a description!')}
          >
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={'Total Test'}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{data.value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color="error">-5.2%</Label>
          <ArrowDownwardWrapper
            sx={{ ml: 0.5, mr: -0.2 }}
            fontSize="small"
          ></ArrowDownwardWrapper>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Customers;
