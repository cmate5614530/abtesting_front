import Text from 'src/components/Text';
import WarningTwoToneIcon from '@material-ui/icons/WarningTwoTone';
import internationalization from 'src/i18n/i18n';

import { useTranslation } from 'react-i18next';
import deFlag from 'country-flag-icons/3x2/DE.svg';
import usFlag from 'country-flag-icons/3x2/US.svg';
import esFlag from 'country-flag-icons/3x2/ES.svg';
import frFlag from 'country-flag-icons/3x2/FR.svg';
import cnFlag from 'country-flag-icons/3x2/CN.svg';
import aeFlag from 'country-flag-icons/3x2/AE.svg';
import {
  Box,
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';

const SectionHeading = experimentalStyled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
`
);

const ImageWrapper = experimentalStyled('img')(
  ({ theme }) => `
        margin-right: ${theme.spacing(1)};
        width: 24px;
`
);

function LanguageToggle() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };

  return (
    <Box>
      <SectionHeading variant="body2" color="text.primary">
        {t('Language Switcher')}
      </SectionHeading>
      <List sx={{ p: 2 }} component="nav">
        <ListItem
          className={getLanguage === 'en' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'en' })}
        >
          <ImageWrapper alt="USA" src={usFlag} />
          <ListItemText primary="USA" />
        </ListItem>
        <ListItem
          className={getLanguage === 'de' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'de' })}
        >
          <ImageWrapper alt="Germany" src={deFlag} />
          <ListItemText primary="Germany" />
        </ListItem>
        <ListItem
          className={getLanguage === 'es' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'es' })}
        >
          <ImageWrapper alt="Spain" src={esFlag} />
          <ListItemText primary="Spain" />
        </ListItem>
        <ListItem
          className={getLanguage === 'fr' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'fr' })}
        >
          <ImageWrapper alt="France" src={frFlag} />
          <ListItemText primary="France" />
        </ListItem>
        <ListItem
          className={getLanguage === 'cn' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'cn' })}
        >
          <ImageWrapper alt="China" src={cnFlag} />
          <ListItemText primary="China" />
        </ListItem>
        <ListItem
          className={getLanguage === 'ae' ? 'active' : ''}
          button
          onClick={() => switchLanguage({ lng: 'ae' })}
        >
          <ImageWrapper alt="United Arab Emirates" src={aeFlag} />
          <ListItemText primary="United Arab Emirates" />
        </ListItem>
      </List>
      <Divider />
      <Text color="warning">
        <Box p={2} sx={{ maxWidth: 340 }}>
          <WarningTwoToneIcon fontSize="small" />
          <Typography variant="body1">
            {t(
              'We only translated a small part of the template, for demonstration purposes'
            )}
            !
          </Typography>
        </Box>
      </Text>
    </Box>
  );
}

export default LanguageToggle;
