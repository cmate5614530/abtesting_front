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
import ArrowUpwardTwoTone from '@material-ui/icons/ArrowUpwardTwoTone';

const ArrowUpwardWrapper = experimentalStyled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
);
function GrossSales() {
  const { t }: { t: any } = useTranslation();

  const data = {
    value: '$3,854.15'
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
        title={'Total Gain'}
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
          <Label color="success">+10%</Label>
          <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default GrossSales;
