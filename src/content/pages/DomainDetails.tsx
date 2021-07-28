import ContentWrapper from 'src/components/ContentWrapper';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Container, Grid, Typography } from '@material-ui/core';
import { useEffect } from 'react';

import { useParams} from 'react-router';
import { format } from 'date-fns';
import { AnyObject } from 'yup/lib/object';
import { Provider, useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store/hooks';
import { viewDomainAction } from 'src/store/action';
import { store } from 'src/store';
import Result from '../dashboards/Analytics/Result';
function DomainDetailsContent() {
    const params:AnyObject = useParams();
    const dispatch= useDispatch();
    const domain = useAppSelector(store => store.domain);

    const fetch = () => {
        dispatch(viewDomainAction(params.id));
    }

    useEffect(() => {
        fetch();
        
    }, []);
  return (
      
    <ContentWrapper title="New Testing">
      <PageTitleWrapper>
        <Grid container alignItems="center">
            <Grid item>
                <Typography variant="h1" component="h1" gutterBottom>
                  {domain.href}   {''}
                </Typography>
                <Typography variant="subtitle2">
                {'These are your analytics stats for today, '}
                <b>{format(new Date(), 'MMMM dd yyyy')}</b>
                </Typography>
            </Grid>
        </Grid>
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
            <Result/>
          </Grid>
        </Grid>
      </Container>
      <Footer></Footer>
    </ContentWrapper>
    
    
  );
}
 function DomainDetails() {
     return (
         <Provider store={store}>
             <DomainDetailsContent/>
         </Provider>
     )
 } 
export default DomainDetails;

