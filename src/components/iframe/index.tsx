import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { domainService } from 'src/services';
import { useDispatch } from 'react-redux';
import { AnyObject } from 'yup/lib/object';
import { Dialog, Button, Zoom, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { setTemplatesForNewExperiment } from 'src/store/action';

import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
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
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
  
export const IFrame = ({ url, onClose, makeWinner, domain, variantId }) => {
    const dispatch = useDispatch();
    const { t }: { t: any } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    
    const params:AnyObject = useParams();
    const [ selected, setInformation ] = useState(null);
    const [ showInfo, setShowInfo ] = useState(false);
    const [ saving, setSaving ] = useState(false);
    const [ fetching, setFetching ] = useState(false);
    const [ selectedIndex, setIndex ] = useState(null);
    const [ showOptions, setShowOptions ] = useState(false);
    const [ showConfirmAction, setConfirmAction ] = useState(false);
    const [ options, setOptions ] = useState([]);

    useEffect(() => {
        window.addEventListener("message", handler)
        
        return () => window.removeEventListener("message", handler)
    }, [])
    
    const handler = ({ data }) => {
        if (data.xpath) {
            setInformation(data)
            setShowInfo(true);
        }
    }

    const toggleShowInfo = () => setShowInfo(!showInfo);
    const toggleOptions = () => {
        setIndex(null);
        setShowOptions(!showOptions);
    }

    const makeThisWinner = async () => {
        await domainService.makeItWinner(domain._id, variantId)
        await domainService.removeActiveButNotWinner(domain._id)
    }

    const fetchInformation = async () => {
        setFetching(true);
        try {
            const response = await domainService.fetchMoreAgainstText({ text: selected.originalText, n_outputs: 3 })
            setOptions(response.data.alternatives)
            setShowOptions(true);
            
        } catch (error) {
            //toast.error('Some error occurred!')
            enqueueSnackbar(t('Some errors occurred!'), {
                variant: 'error',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
        }
        setFetching(false);
        setShowInfo(false);

    }

    const fetchAgain = () => {
        setShowInfo(true);
        setShowOptions(false);
        setOptions([]);
        setIndex(null);
        fetchInformation();
    }


    const selectTemplate = async () => {
        if (makeWinner) {
            await makeThisWinner();
        }
        let change = {
            property_level_1: "innerHTML",
            property_level_2: null,
            value: options[selectedIndex]
        };
        let isForm = selected.tagType === 'form';
        let event = {
            name: isForm ? "submit" : 'click',
            fallback_name: isForm ? "onsubmit" : 'onclick',
            execute_converted: true,
            custom_callback: null
        }
        const informationToSave = {
            ...selected,
            ...(isCallToAction() ? { event } : { change }),
            isConversion: isCallToAction()
        }
        try {
            setSaving(true)
            const response = await domainService.saveTemplateForDomain(params.id, informationToSave);
            dispatch(setTemplatesForNewExperiment(response.data.data))
            console.log('*****line 153*****', response);
            if (isCallToAction()) {
                //toast.success('Element saved successfully!');
                enqueueSnackbar(t('Element saved successfully!'), {
                    variant: 'success',
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                });
                setSaving(false);
                onClose();
            } else {
                saveOriginalOne()
            }
        } catch (error) {
            //toast.error('Some error occurred!');
            enqueueSnackbar(t('Some error occurred!'), {
                variant: 'error',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
            console.error(error);
        }
    }

    const saveOriginalOne = async () => {
        try {
            let change = {
                property_level_1: "innerHTML",
                property_level_2: null,
                value: selected.originalText
            };
            const informationToSave = {
                ...selected,
                change,
                isOriginal: true
            }
            const response = await domainService.saveTemplateForDomain(params.id, informationToSave);
            //toast.success('Element saved successfully!');
            enqueueSnackbar(t('Element saved successfully!'), {
                variant: 'success',
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
                },
                TransitionComponent: Zoom
            });
            if(response.data?.data?.success !== false){
            dispatch(setTemplatesForNewExperiment(response.data.data))
            }
            console.log('Original', response);
            

            setSaving(false);
            onClose();
        } catch (error) {
            setSaving(false);
            console.error(error);
            
        }
    }

    const isCallToAction = () => ['form', 'button', 'a'].includes(selected?.tagType)

    const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIndex((event.target as HTMLInputElement).value);
      };

    if (!url) return <React.Fragment></React.Fragment>
    return (
         
        <React.Fragment>
            {/* <button  onClick={onClose}>Close</button> */}
            <h1>Please Select Your Text to Test : </h1>
            <iframe id="url-scrapped" className="w-100" src={url} style={{border:'none !important',borderRadius:'5px', width:'100%', height:'600px'}}></iframe>

            <Dialog
                open={showInfo}
                maxWidth="sm"
                fullWidth
                keepMounted
                onClose={toggleShowInfo}
                aria-labelledby="customized-dialog-title"
            >
                <DialogTitle id="customized-dialog-title" onClose={toggleShowInfo}>
                { isCallToAction () ? 'Conversion Element' : 'Retreive Information'}
                </DialogTitle>
                <DialogContent dividers>
                    <p className="showInfo" style={{background:'silver',color:'black', borderRadius:'5px',width:'100%', padding:'10px', overflowX:'auto'}}>{selected?.xpath}</p>
                    {
                        (isCallToAction()) ? (
                            <Button style={{width:'100%', background:'#28a745'}} variant="contained"  onClick={selectTemplate} disabled={saving}>
                                { saving ? 'Saving...' : 'Save' }
                            </Button>
                        ) : (
                            <Button color="primary" style={{width:'100%'}} variant="contained"  onClick={fetchInformation}>
                                {
                                    fetching ? 'Fetching...' : 'Fetch'
                                }
                            </Button>
                        )
                    }
                </DialogContent>
            
            </Dialog>
            <Dialog open={showOptions} onClose={toggleOptions} maxWidth="sm" fullWidth keepMounted>
                    <DialogTitle onClose={toggleOptions}>
                        Choose alternate text
                    </DialogTitle>
                    <DialogContent dividers>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={selectedIndex} onChange={handleRadio}>
                            {
                                options.map((text, i) => (
                                        <FormControlLabel key={`option-${i}`} value={`${i}`} control={<Radio />} label={text} />
                                ))
                            }
                            </RadioGroup>
                        </FormControl>
                    <Button color="primary" variant="contained" style={{width:'100%', marginTop:'10px', marginBottom:'10px'}} onClick={fetchAgain}>Fetch again</Button>
                    <br/>
                    {
                        (selectedIndex !== null) && <Button variant="contained"  style={{width:'100%',backgroundColor:"#28a745", marginBottom:'15px'}} onClick={selectTemplate} disabled={saving}>
                            { saving ? 'Saving...' : 'Save' }
                        </Button>
                    }
                    </DialogContent>
            </Dialog>
            {/* <ConfirmationComponent  show={showConfirmAction} message={'Are you sure you want to make it conversion?'} loading={saving} loadingText="Adding call to Action" onHide={() => setConfirmAction(false)}  onConfirm={selectTemplate}/> */}
        
        </React.Fragment>
        
    )
}