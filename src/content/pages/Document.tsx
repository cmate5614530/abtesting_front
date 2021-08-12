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
import { AnyObject } from 'yup/lib/types';
function DocumentContent(){

    return (
    <ContentWrapper title="New Testing">
        <PageTitleWrapper>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h1" component="h1" gutterBottom>
                    {'How to use?'}
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
                    Copy and Paste this script in your html head tag:<br></br>
                    {/* {Config.JS_SCRIPT} */}
                    {'<script src="http://108.61.158.67/:3006/api/v1/domain/kevin-stevens.js"></script>'}
                </Grid>
            </Grid>
        </Container>
        <Footer></Footer>
    </ContentWrapper>
    )
}
function Document() {
    return (
        <Provider store={store}>
            <DocumentContent/>
        </Provider>
    )
} 
export default Document;