import { Button, CircularProgress, Container, Dialog, DialogContentText, Grid, IconButton, Link, Switch, TextField, Tooltip, Typography, Zoom } from '@material-ui/core';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
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
import { createNewExperiment, fetchExperimentById, fetchExperiments, viewDomainAction } from 'src/store/action';
import { useAppSelector } from 'src/store/hooks';
import ActiveReferrals from '../../dashboards/Analytics/ActiveReferrals';
import BounceRate from '../../dashboards/Analytics/BounceRate';
import ConversionsAlt from '../../dashboards/Analytics/ConversionsAlt';
import PendingInvitations from '../../dashboards/Analytics/PendingInvitations';
import { useSnackbar } from 'notistack';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { isActionable, isChangeAble, mutateAIResponse } from 'src/helpers';
import { AnyObject } from 'yup/lib/object';
let removedWinnerTemplates = [];

const styles:AnyObject = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute !important',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props:AnyObject) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h3">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

export const VariantsComponent = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    const domain = useAppSelector(store => store.domain);
    const dispatch = useDispatch();
    const params:any = useParams();
    const [loading, setLoading] = useState(true);
    const {userExperiments, experiment, isNewExperiment, newTemplates} = useAppSelector(store => store.experiment);
    const { t }: { t: any } = useTranslation();
    const [templates, setTemplates] = useState([]);
    const [ conversionURL, setConversionURL ] = useState('');
    const [ saving, setSaving ] = useState(false);
    const [ showScript, setShowScript ] = useState(false);
    const [ showConversionModal, setShowConversionModal ] = useState(false);
    const [ isConversion, setIsConversion ] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const history = useHistory();
    const [showConfirmWinner, setConfirmationIfWinner] = useState(false);
    const [error, setError] = useState<string>('');


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

    const getConversions = (template) => {
        return template?.visitors.filter(v => v.converted).length
    }

    const conversionRate = (template) => {
        const visitors = template?.visitors.length;
        const conversions = getConversions(template);
        if (visitors === 0 || conversions === 0) return 0;
        return Math.round((conversions/visitors) * 100);
    }

    const isSignificant = (template) => {
        const visitors = template.visitors.length;
        if (visitors < 1) return false;
        if (conversionRate(template) >= 90) return true;
        return false;
    }

    const sortedTemplates = () => {
        const $t = [...(templates || [])].filter(t => t.isConversion === isConversion).map(t => {

            return {
                ...t,
                isSignificant: isSignificant(t),
                conversionRate: conversionRate(t),
                conversions: getConversions(t)
            }
        });
        $t.sort((a, b) => a.visitors.length - b.visitors.length).reverse()
        return $t;
    }

    const activatedVariants = () => sortedTemplates()?.filter(t => t.isConversion === isConversion && t.isActive && !t.isWinner) || [];
    const readyToActive = () => sortedTemplates()?.filter(t => t.isConversion === isConversion && !t.isActive && !t.isWinner) || [];
    const alreadyWinnerVariants = () => sortedTemplates()?.filter(t => t.isWinner && t.isConversion === t.isConversion) || [];

    const activatedAndReadyVariants = () => sortedTemplates()?.filter(t => t.isConversion === isConversion  && !t.isWinner) || [];
    const activatedAndReadyAndWinnerVariants = () => sortedTemplates()?.filter(t => t.isConversion === isConversion) || [];

    const saveURLConversion = async () => {
        if(conversionURL.trim().length < 5) setError('Invalid input');
        else{
            setSaving(true);
            await domainService.saveURLConversion(domain._id, conversionURL);
            props.refreshData();
            setSaving(false);
            toggleConversionModal();
        }
    }

    const toggleScript = () => setShowScript(!showScript);
    const toggleConversionModal = () => setShowConversionModal(!showConversionModal);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

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
            props.refreshData();
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
    
    const fetch = () => {
        dispatch(viewDomainAction(domain._id));
    }

    const resetExperiments = async () => {
        setSaving(true);
        await domainService.resetExperiments(domain._id)
        fetch();
        if(domain._id)  dispatch(fetchExperiments(domain._id)); 
        dispatch(fetchExperimentById(experiment._id));
        setSaving(false);
    }

    const pauseConversion = async () => {
        try {
            console.log('Is Running' , isRunning);
            if(isRunning){
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
            props.refreshData();
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

    const getActiveTemplateIds = () => {
        return templates.reduce((_store,current) => {
            if(current.isActive) _store.push(current._id);
            return _store;
        },[]);
    }
    const getPrevActiveTemplateIds = () => {
        return templates.reduce((_store,current) => {
            if(!current.isActive && current.prevActive) _store.push(current._id);
            return _store;
        },[]);
    }

    const deleteThis = async (id) => {
        await domainService.deleteVariant(id);
        //fetch();
        setTemplates(templates.filter(t=>t._id !== id));
    }

    const createExperiment = () => {
        dispatch(createNewExperiment());
        //setIframeOpened(true);
    }

    useEffect(() => {
        setTemplates(props.templates);
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
    }, [ props ])

    return (
        <>
    
            
           <Grid item xs={12} md={4}>
                <Button 
                    variant="contained" 
                    style={{marginLeft:'30px'}}
                    color="primary" 
                    onClick={toggleConversionModal}
                >
                    {'Set Conversion Item'}
                </Button>
            </Grid>
            <Grid item xs={12} md={4} style={{display:'flex', alignItems:'center'}}>
                <Grid item>Alternative</Grid>
                <Grid item>
                    <Switch
                    id="custom-switch"
                    checked={isConversion}
                    onChange={() => setIsConversion(!isConversion)}
                    color="primary"
                />
                </Grid>
                <Grid item>Action able</Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button 
                    variant="contained" 
                    style={{marginLeft:'30px'}}
                    color="secondary" 
                    onClick={resetExperiments}
                    disabled={saving}
                >
                    { saving ? 'Saving...' : 'Reset Experiments' }
                </Button>
            </Grid>
            
        {
             domain && (isConversion ? activatedAndReadyVariants() : activatedAndReadyAndWinnerVariants()).map((item, index)=> {
                return (
                
                <Grid item xs={12} md={6} key={index} style={item.isWinner? {border:'#5569ff solid 4px', borderRadius:'10px'} :{}}>
                    {/* <div style={{background:'#5569ff',position:'relative',paddingTop:'33px', bottom:'83px', fontSize:'20px', color:'#fff', padding:'8px',border:'4px solid #fff', textAlign:'center', borderRadius:'50%', width:'108px', height:'108px'}}>Winner</div> */}
                    <Typography variant="h1" component="h1" gutterBottom>
                             {(!item.isOriginal) ? 'Version '+(index+1) : 'Version '+(index+1)+'(Original)'}
                             <Tooltip title={'Delete'} arrow>
                                <IconButton
                                    onClick={()=>deleteThis(item._id)}
                                    color="primary"
                                >
                                    <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                        </Tooltip>
                    </Typography>
                    <Link href={`http://${domain.domain}?ekkelai_ab_test_id=${item._id}`} target='_blank' style={{float:'right'}}>{t('See Live')}</Link>
                
                
                    <Form.Group>
                            <Form.Check readOnly type="checkbox" className="activeCheckBox" checked={item.isActive} onClick={()=>changeTemplateStatus(item)}/>
                    </Form.Group>
                    {
                        item.jpeg_path && <img src={`${Config.BACKEND}/${item.jpeg_path}`} style={{maxWidth:'100%'}}/>
                    }
                    <p>{
                        (isChangeAble(item.tagType)) ? 
                        item?.change?.value 
                        :(isActionable(item.tagType)) ? 
                            <>
                                <b>XPath: </b>{item.xpath}<br/>
                                <b>Title: </b>{item.originalText}<br/>
                                <b>Type: </b>{item.tagType.toUpperCase()}
                            </>
                            : ''
                    
                    }</p>
                    
                    <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    >
                        <Grid item sm={6} xs={12}>
                            <ActiveReferrals value={item.visitors.length}/>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <PendingInvitations value={item.conversions}/>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <BounceRate value={item.isSignificant ? 'YES' : 'NO'}/>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ConversionsAlt value={item.conversionRate} />
                        </Grid>
                    </Grid>                           
                </Grid>
                
                )
            })    
        }

        
        
        { 
        experiment && experiment.isActive && 
        <Grid item xs={12} md={12} style={{display:'flex', alignItems:'center'}}>
                <Grid item>Paused</Grid>
                <Grid item>
                    <Switch
                    id="custom-switch"
                    checked={isRunning}
                    onChange={pauseConversion}
                    color="primary"
                />
                </Grid>
                <Grid item>Running</Grid>
        </Grid>                
        }
        
        
        <Dialog
        open={showConversionModal}
        maxWidth="sm"
        fullWidth
        keepMounted
        onClose={toggleConversionModal}
        aria-labelledby="customized-dialog-title1"
        >
            <DialogTitle id="customized-dialog-title1" onClose={toggleConversionModal}>
                
            </DialogTitle>
            <DialogContent >
                <h1 style={{textAlign:'center'}}>{ 'Choose Your Conversion Event'}</h1>    
                <TextField
                    error={Boolean(error)}
                    helperText={error}
                    label={'Conversion URL'}
                    placeholder={'e.g. https://google.com'}
                    value={conversionURL}
                    onChange={e=>{setConversionURL(e.target.value);setError('');}}
                    fullWidth
                    variant="outlined"
                />
                {/* <Button 
                    color="primary" 
                    variant="contained" 
                    style={{ marginTop:'10px', marginBottom:'10px', float:'right'}} 
                    onClick={saveURLConversion}
                    startIcon={saving ? <CircularProgress size="1rem" /> : null}
                    disabled={saving}
                >
                    Save URL
                </Button> */}
                <h1 style={{textAlign:'center'}}>{ '-OR-'}</h1> 
                <Button 
                    color="primary" 
                    variant="contained" 
                    style={{ marginBottom:'25px'}} 
                    fullWidth
                    size="large"
                    onClick={props.createExperiment}
                    startIcon={saving ? <CircularProgress size="1rem" /> : null}
                    disabled={saving}
                >
                    Choose From Web page
                </Button>
            </DialogContent>
        </Dialog>
        </>
    )
}