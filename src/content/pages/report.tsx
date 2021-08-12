import { Button, CircularProgress, Container, Grid, Typography, Zoom } from '@material-ui/core';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import ContentWrapper from 'src/components/ContentWrapper';
import Footer from 'src/components/Footer';
import {IFrame} from 'src/components/iframe';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Config} from 'src/environment'
import { domainService, experimentService } from 'src/services';
import { store } from 'src/store';
import { createNewExperiment, createNewExperimentSuccess, fetchExperimentById, fetchExperiments, viewDomainAction } from 'src/store/action';
import { useSnackbar } from 'notistack';
import { useAppSelector } from 'src/store/hooks';
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
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const [showConfirmWinner, setConfirmationIfWinner] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [ saving, setSaving ] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    
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

    const saveExperiment =  () => {
        try {
            console.log('Started');
            setLoading(true);
            const templates = templatesToDisplay;
            const length = userExperiments?.length;
            console.log('---userExperiments---', userExperiments);
            const name = length > 0 ?  `Experiment ${length + 1}` : `Experiment 1`;
            if(templates.length !== 0){
              experimentService.create({domain,templates,name}).then((result) => {
                //console.log(result);
                if(result.data?.data?.success === false) {
                    //console.log(result);
                    // toast.error(result.data?.data?.message);
                    enqueueSnackbar(result.data?.data?.message, {
                      variant: 'error',
                      anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right'
                      },
                      TransitionComponent: Zoom
                    });
                } else {
                    // toast.success('Experiment Created Successfully');
                    enqueueSnackbar('Experiment Created Successfully', {
                      variant: 'success',
                      anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right'
                      },
                      TransitionComponent: Zoom
                    });
                    console.log('---result  --', result);
                    //fetchAndLoadExperiments(domain._id);
                    history.push('/domain/details/'+domain._id+'/'+result.data.data._id);
                }
              });
          
            } else {
                // toast.error('Please Select templates to save');
                enqueueSnackbar('Please Select templates to save', {
                    variant: 'error',
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                });
            }
            
        } catch (error) {
            // toast.error(error);
            enqueueSnackbar(error, {
              variant: 'error',
              anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
              },
              TransitionComponent: Zoom
            });
        } finally {
            setLoading(false);
            dispatch(createNewExperimentSuccess());
        }
    }

    const makeLive = async () => {
        try {
            setSaving(true)
            await experimentService.makeExperimentActive(experiment._id);
            const ids = templates.reduce((_store, current) => {
                if (current.isActive) _store.push(current._id);
                return _store;
            }, []);
            
            await domainService.changeVariantStatus(domain._id, ids);
            await domainService.removeWinnerToOnlyActiveTemplates(domain._id, removedWinnerTemplates);
            removedWinnerTemplates = [];
            const { length } = ids;
            fetch();
            if(domain._id)  dispatch(fetchExperiments(domain._id)); 
            dispatch(fetchExperimentById(experiment._id));
            // toast.success(length > 0 ? `${ length === 1 ? '1 Variant is' : `${length} Variants are`} live now.` : 'No variant is applied.')
            enqueueSnackbar(length > 0 ? `${ length === 1 ? '1 Variant is' : `${length} Variants are`} live now.` : 'No variant is applied.', {
                variant: 'success',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
        } catch (error) {
            // toast.error('Some error occurred!')
            enqueueSnackbar(t('Some errors occurred!'), {
                variant: 'error',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
        }
        setSaving(false)
    }
    
    const getPrevActiveTemplateIds = () => {
        return templates.reduce((_store,current) => {
            if(!current.isActive && current.prevActive) _store.push(current._id);
            return _store;
        },[]);
    }

    const getActiveTemplateIds = () => {
        return templates.reduce((_store,current) => {
            if(current.isActive) _store.push(current._id);
            return _store;
        },[]);
    }

    const pauseConversion = async () => {
        try {
            console.log('Is Running' , isRunning);
            if(isRunning){
                setIsRunning(false);
                const ids = getActiveTemplateIds();
                await domainService.pauseVariants(domain._id, ids);
                // toast.success(ids.length > 0 ? `Variants Paused` : 'No variant is applied.')
                enqueueSnackbar(ids.length > 0 ? `Variants Paused` : 'No variant is applied.', {
                    variant: 'success',
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                });
            } else {
                setIsRunning(true)
                const ids = getPrevActiveTemplateIds();
                await domainService.resumeVariants(domain._id, ids);
                // toast.success(ids.length > 0 ? `Variants Resumed` : 'No previous variant is applied.')
                enqueueSnackbar(ids.length > 0 ? `Variants Resumed` : 'No previous variant is applied.', {
                    variant: 'success',
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                });
            }
            fetch();
            if(domain._id)  dispatch(fetchExperiments(domain._id)); 
            dispatch(fetchExperimentById(experiment._id));
        } catch (error) {
            // toast.error('Some error occurred!')
            enqueueSnackbar(t('Some errors occurred!'), {
                variant: 'error',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
        }
    }

    const changeTemplateStatus = (template) => {
        const isAlreadyWinner = domain.templates.some(t => t.xpath === template.xpath && t.isWinner);
        if(isAlreadyWinner && !template.isActive) toggleConfirmWinner();
        else _confirmChangeStatus(template);
    }

    const toggleConfirmWinner = () => setConfirmationIfWinner(!showConfirmWinner);

    const _confirmChangeStatus = (template) => changeStatus(template._id, !template.isActive);

    const changeStatus = async (id, isActive, removeWinner = false) => {

        const mappedTemplates = templates.map(t => t._id !== id ? t : { ...t, isActive });
        setTemplates([...mappedTemplates]);

        // Remove Winner for Re test
        if (removeWinner && isActive) removedWinnerTemplates.push(id)
        else removedWinnerTemplates = removedWinnerTemplates.filter( _id => _id !== id )
    }

    useEffect(()=>{
        setTemplates(templatesToDisplay);
        fetch();
        console.log('==params==', params);
        fetchExperiment(params.expid);
        if(domain._id) fetchAndLoadExperiments(domain?._id);

        const ids = experiment?.templates && experiment?.templates.reduce((_store, current) => {
            // console.log(current);
            if (current.isActive) _store.push(current._id);
            return _store;
        }, []);
        if(ids && ids.length > 0) {
            console.log('Ids ', ids);
            console.log('Setting to true');
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
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

        if(!iframeOpened && domain && isNewExperiment){
            console.log('==========here is line 257--', domain, isNewExperiment)
            saveExperiment();
        }
    }, [domain._id, userExperiments.length, iframeOpened, isNewExperiment,params.expid])

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
                        {
                            experiment && !experiment.isActive && <>
                                <Button 
                                    variant="contained" 
                                    style={{marginLeft:'30px'}}
                                    color="primary" 
                                    onClick={makeLive}
                                    disabled={saving}
                                >
                                    { saving ? 'Saving...' : 'Make Live' }
                                </Button>
                            </>
                        }
                        {
                            experiment && experiment.isActive && isRunning &&<>
                                <Button 
                                    variant="contained" 
                                    style={{marginLeft:'30px'}}
                                    color="primary" 
                                    onClick={pauseConversion}
                                    disabled={saving}
                                >
                                    { saving ? 'Saving...' : 'Pause Experiment' }
                                </Button>
                            </>
                        }
                        {
                            experiment && experiment.isActive && !isRunning &&<>
                                <Button 
                                    variant="contained" 
                                    style={{marginLeft:'30px'}}
                                    color="primary" 
                                    onClick={pauseConversion}
                                    disabled={saving}
                                >
                                    { saving ? 'Saving...' : 'Resume Experiment' }
                                </Button>
                            </>
                        }
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
                <VariantsComponent experiment={experiment} templates={templatesToDisplay} refreshData={fetch} createExperiment={createExperiment}/>                   
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