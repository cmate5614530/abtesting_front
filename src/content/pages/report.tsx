import { Button, CircularProgress, Container, Grid, Link, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Provider, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import ContentWrapper from 'src/components/ContentWrapper';
import Footer from 'src/components/Footer';
import {IFrame} from 'src/components/iframe';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Config} from 'src/environment'
import { experimentService } from 'src/services';
import { store } from 'src/store';
import { createNewExperiment, fetchExperimentById, fetchExperiments, viewDomainAction } from 'src/store/action';
import { useAppSelector } from 'src/store/hooks';
import ActiveReferrals from '../dashboards/Analytics/ActiveReferrals';
import BounceRate from '../dashboards/Analytics/BounceRate';
import ConversionsAlt from '../dashboards/Analytics/ConversionsAlt';
import PendingInvitations from '../dashboards/Analytics/PendingInvitations';
import { VariantsComponent } from './variants/variants.components';
let removedWinnerTemplates = [];
function Report(){
    const domain = useAppSelector(store => store.domain);
    const dispatch = useDispatch();
    const params:any = useParams();
    const [loading, setLoading] = useState(true);
    const {userExperiments, experiment, isNewExperiment, newTemplates} = useAppSelector(store => store.experiment);
    const { t }: { t: any } = useTranslation();
    const [ iframeOpened, setIframeOpened ] = useState(false);
    
    const [showConfirmWinner, setConfirmationIfWinner] = useState(false);

    const onClose = () => {
        setIframeOpened(false);
        fetch();
    }
    const fetch = () => {
        dispatch(viewDomainAction(params.id));
    }

    const fetchAndLoadExperiments = (domainId) => {
        setLoading(true);
        try {
            dispatch(fetchExperiments(domainId));    
        
        } catch (error) {
            console.error(error);
            // toast.error(error);
        } finally {
            setLoading(false);
  
        }
       
    }

    const fetchExperiment = async (e) => {
        try {
            setLoading(true);
            dispatch(fetchExperimentById(e));
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    }

    const experimentTemplates  = experiment?.templates || [];
    const newTemplatesToSave = newTemplates || [];
    const templatesToDisplay = [...experimentTemplates, ...newTemplatesToSave]

    const createExperiment = () => {
        dispatch(createNewExperiment());
        setIframeOpened(true);
    }

    useEffect(()=>{
        fetch();
        console.log('==params==', params);
        fetchExperiment(params.expid);
      
        // show acivated experiment first by default
        // if(domain._id) fetchAndLoadExperiments(domain?._id);
        // console.log(experiment);
        // if(userExperiments.length > 0) {
        //     const latestExperiment = userExperiments && userExperiments[userExperiments.length - 1];
        //     const activeExperiment = userExperiments && userExperiments.filter(exp => exp.isActive);
        //     console.log('User ', userExperiments);
        //     console.log('Active', activeExperiment);
        //     console.log('Latest', latestExperiment);
  
        //     const loadExperiment = activeExperiment.length > 0 ? activeExperiment[0] : latestExperiment
  
        //     dispatch(fetchExperimentById(loadExperiment._id));
            
        // }
        // show activated experiment first by default
    }, [domain._id, userExperiments.length])

    return (
        <ContentWrapper title="New Testing">
        <PageTitleWrapper>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h1" component="h1" gutterBottom>
                        {domain.href} {experiment?.name} {(experiment && experiment.isActive) ? '(Active)' : ''}
                        <Button 
                            variant="contained" 
                            style={{marginLeft:'30px'}}
                            color="primary" 
                            onClick={createExperiment} 
                            startIcon={loading ? <CircularProgress size="1rem" /> : null}
                            disabled={loading}>
                            {'Add New Version'}
                        </Button>
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
            justifyContent="left"
            alignItems="stretch"
            spacing={3}
            >
            
                {   (!iframeOpened && templatesToDisplay) &&
                <VariantsComponent experiment={experiment} templates={templatesToDisplay} refreshData={fetch}/>                   
                }

            
            </Grid>
            {(iframeOpened && domain) && (
            <div className="col-md-12 iframe" style={{width:'100%'}}>
                <IFrame url={`${Config.BACKEND}/${domain.directory}`} onClose={onClose} makeWinner={false} domain={domain} variantId=''></IFrame>
            </div>

            )}
        </Container>
        <Footer></Footer>
    </ContentWrapper>
    )
}

function ReportPage(){
    return (
        <Provider store={store}>
            <Report/>
        </Provider>
    )
}
export default ReportPage;