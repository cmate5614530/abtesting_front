import { Box, Card, Container, Typography } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';

const FooterWrapper = experimentalStyled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(3)};
`
);

const FooterContent = experimentalStyled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        padding: ${theme.spacing(3, 0)};
`
);

function Footer() {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <FooterContent
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          textAlign={{ xs: 'center', md: 'left' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle1">
              &copy; 2021 - Tokyo React Admin Dashboard
            </Typography>
          </Box>
          <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
            Crafted by BloomUI.com
          </Typography>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
