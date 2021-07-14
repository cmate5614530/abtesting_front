import ContentWrapper from 'src/components/ContentWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';

import ActiveReferrals from './ActiveReferrals';
import RecentOrders from './RecentOrders';

import { Container, Grid } from '@material-ui/core';

function DashboardAnalytics() {
  return (
    <ContentWrapper title="Analytics Dashboard">
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <PageHeader />
          </Grid>
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
          <Grid item sm={6} xs={12}>
            <ActiveReferrals />
          </Grid>
          <Grid item sm={6} xs={12}>
            Grid Item
          </Grid>
          <Grid item sm={6} xs={12}>
            Grid Item
          </Grid>
          <Grid item sm={6} xs={12}>
            Grid Item
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </ContentWrapper>
  );
}

export default DashboardAnalytics;
