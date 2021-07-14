import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
import ContentWrapper from 'src/components/ContentWrapper';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';

import { useTranslation } from 'react-i18next';
import { experimentalStyled } from '@material-ui/core/styles';

const MainContent = experimentalStyled(Box)(
  ({ theme }) => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const OutlinedInputWrapper = experimentalStyled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

function Status404() {
  const { t }: { t: any } = useTranslation();

  return (
    <ContentWrapper title="Status - 404">
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="404" height={180} src="/static/images/status/404.svg" />
            <Typography variant="h2" sx={{ my: 2 }}>
              {t("The page you were looking for doesn't exist.")}
            </Typography>
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
              sx={{ mb: 4 }}
            >
              {t(
                "It's on us, we moved the content to a different page. The search below should help!"
              )}
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <FormControl variant="outlined" fullWidth>
                <OutlinedInputWrapper
                  type="text"
                  placeholder={t('Search terms here...')}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="contained" size="small">
                        {t('Search')}
                      </Button>
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Divider sx={{ my: 4 }}>OR</Divider>
              <Button href="/overview" variant="outlined">
                {t('Go to homepage')}
              </Button>
            </Card>
          </Container>
        </Container>
      </MainContent>
    </ContentWrapper>
  );
}

export default Status404;
