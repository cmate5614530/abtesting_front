import ContentWrapper from 'src/components/ContentWrapper';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import AudienceOverview from './AudienceOverview';
import Conversions from './Conversions';
import TopLandingPages from './TopLandingPages';
import ActiveReferrals from './ActiveReferrals';
import PendingInvitations from './PendingInvitations';
import BounceRate from './BounceRate';
import ConversionsAlt from './ConversionsAlt';
import SessionsByCountry from './SessionsByCountry';
import TrafficSources from './TrafficSources';
import { Container, Grid } from '@material-ui/core';

import GrossSales from './GrossSales';
import Customers from './Customers';
import Orders from './Orders';
import Refunds from './Refunds';
import Results from './Results';
import type { Project } from 'src/models/project';
import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';
import useRefMounted from 'src/hooks/useRefMounted';

function DashboardAnalytics() {
  const isMountedRef = useRefMounted();
  const [projects, setProjects] = useState<Project[]>([]);

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get<{ projects: Project[] }>(
        '/api/projects'
      );

      if (isMountedRef.current) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <ContentWrapper title="Analytics Dashboard">
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item lg={3} sm={6} xs={12}>
                <GrossSales />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Customers />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Orders />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Refunds />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <AudienceOverview />
          </Grid>
          <Grid item xs={12}>
            <Results projects={projects}/>
          </Grid>
        </Grid>
      </Container>
      <Footer></Footer>
    </ContentWrapper>
  );
}

export default DashboardAnalytics;
