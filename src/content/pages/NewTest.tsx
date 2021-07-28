import { Container, Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import {  useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import ContentWrapper from 'src/components/ContentWrapper';
import Footer from 'src/components/Footer';
import {IFrame} from 'src/components/iframe';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Config} from 'src/environment'
import { store } from 'src/store';
import { viewDomainAction } from 'src/store/action';
import { useAppSelector } from 'src/store/hooks';
function NewTestContent(){
    const domain = useAppSelector(store => store.domain);
    const dispatch = useDispatch();
    const params:any = useParams();
    const onClose = () => {
        fetch();
    }
    const fetch = () => {
        dispatch(viewDomainAction(params.id));
    }
    useEffect(()=>{
        fetch();
    }, [domain._id])
    return (
    <ContentWrapper title="New Testing">
        <PageTitleWrapper>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h1" component="h1" gutterBottom>
                    {domain.href}
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
                <Grid item xs={12} >
                    <div className="col-md-12 iframe">
                        <IFrame url={`${Config.BACKEND}/${domain.directory}`} onClose={onClose} makeWinner={false} domain={domain} variantId=''/>
                        {/* <IFrame url={`http://${domain.domain}`} onClose={onClose}/> */}
                    </div>
                </Grid>
            </Grid>
        </Container>
        <Footer></Footer>
    </ContentWrapper>
    )
}

function NewTest() {
    return (
        <Provider store={store}>
            <NewTestContent/>
        </Provider>
    )
} 
export default NewTest;