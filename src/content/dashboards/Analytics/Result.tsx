import {
  FC,
  ChangeEvent,
  MouseEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  MenuItem,
  Link,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  Zoom,
  CardMedia,
  lighten,
  CircularProgress
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import type { Project, ProjectStatus } from 'src/models/project';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { experimentalStyled } from '@material-ui/core/styles';
import LaunchTwoToneIcon from '@material-ui/icons/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import GridViewTwoToneIcon from '@material-ui/icons/GridViewTwoTone';
import TableRowsTwoToneIcon from '@material-ui/icons/TableRowsTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { useSnackbar } from 'notistack';
import { formatDistance, format } from 'date-fns';
import Text from 'src/components/Text';

import { domainService, experimentService } from 'src/services';
import { IFrame } from 'src/components/iframe';
import { Config } from 'src/environment';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from 'src/store';
import { useAppSelector } from 'src/store/hooks';
import { AnyObject } from 'yup/lib/object';
import { useLocation, useParams } from 'react-router';
import { createNewExperiment, createNewExperimentSuccess, fetchExperimentById, fetchExperiments, viewDomainAction } from 'src/store/action';
import AudienceOverview from './AudienceOverview';
const DialogWrapper = experimentalStyled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = experimentalStyled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = experimentalStyled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);


interface ResultsProps {
  projects: Project[];
}

interface Filters {
  status?: ProjectStatus;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getProjectStatusLabel = (projectStatus: ProjectStatus): JSX.Element => {
  const map = {
    not_started: {
      text: 'Not started',
      color: 'error'
    },
    in_progress: {
      text: 'In progress',
      color: 'info'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    }
  };

  const { text, color }: any = map[projectStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  projects: Project[],
  query: string,
  filters: Filters
): Project[] => {
  return projects.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && project.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (
  tests: any,
  page: number,
  limit: number
): any => {
  return tests.slice(page * limit, page * limit + limit);
};

function ResultContent(){
  
  const dispatch = useDispatch();
  const domain = useAppSelector(store => store.domain);
  const {userExperiments, experiment, isNewExperiment, newTemplates} = useAppSelector(store => store.experiment);
  const [ loading, setLoading ] = useState(true);
  const [ iframeOpened, setIframeOpened ] = useState(false);
  const params:AnyObject = useParams();
  const location = useLocation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const paginatedTests = applyPagination(userExperiments, page, limit);
  const { t }: { t: any } = useTranslation();

  const fetchExperiment = async (e) => {
      try {
          setLoading(true);
          dispatch(fetchExperimentById(e.value));
      } catch (error) {
          
      }
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


  useEffect(() => {
      fetch();
      const query = new URLSearchParams(location.search);
      if (query.get('select') === 'true') setIframeOpened(true);
      if(domain._id) fetchAndLoadExperiments(domain?._id);
      if(userExperiments.length > 0) {
          const latestExperiment = userExperiments && userExperiments[userExperiments.length - 1];
          const activeExperiment = userExperiments && userExperiments.filter(exp => exp.isActive);
          console.log('User ', userExperiments);
          console.log('Active', activeExperiment);
          console.log('Latest', latestExperiment);

          const loadExperiment = activeExperiment.length > 0 ? activeExperiment[0] : latestExperiment

          dispatch(fetchExperimentById(loadExperiment._id));
          
      }


  }, [domain._id,userExperiments.length])

  

  const onClose = () => {
      setIframeOpened(false)
      fetch();
  }

  const experimentTemplates  = experiment?.templates || [];
  const newTemplatesToSave = newTemplates || [];
  const templatesToDisplay = [...experimentTemplates, ...newTemplatesToSave]

  const [selectedItems, setSelectedTests] = useState<string[]>([]);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [modalDomain, setModalDomain] = useState<string>('');

  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(true);
    setModalDomain(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setModalDomain('');
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleDeleteCompleted = (id) => {
    domainService.deleteDomain(id).then((response) => {
      setOpenConfirmDelete(false);

      enqueueSnackbar(t('The projects has been deleted successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
      // setDomains(domains.filter(({ _id }) => _id !== id));
    }, error => {
        console.log(error);
    })
    
  };
  const saveExperiment = async () => {
      try {
          console.log('Started');
          setLoading(true);
          const templates = templatesToDisplay;
          const length = userExperiments?.length;
          const name = length > 0 ?  `Experiment ${length + 1}` : `Experiment 1`;
          if(templates.length !== 0){
          const result = await experimentService.create({domain,templates,name});
          console.log(result);
          if(result.data?.data?.success === false) {
              console.log(result);
              // toast.error(result.data?.data?.message);
          } else {
              // toast.success('Experiment Created Successfully');
              fetchAndLoadExperiments(domain._id);
          }
          } else {
              // toast.error('Please Select templates to save');
          }
          
      } catch (error) {
          // toast.error(error);
      } finally {
          setLoading(false);
          dispatch(createNewExperimentSuccess());
      }
  }

  const createExperiment = () => {
      dispatch(createNewExperiment());
      setIframeOpened(true);
  }
  return (
    <>
      {(!iframeOpened && domain) && (
        <>
        <AudienceOverview />

        <br></br>
        <Typography variant="h1" component="h1" gutterBottom>
              {'Tests'}
              {!isNewExperiment &&
              <Button 
                variant="contained" 
                style={{marginLeft:'30px'}}
                color="primary" 
                // href={'/domain/details/'+domain._id+'/new'} 
                onClick={createExperiment}
                startIcon={loading ? <CircularProgress size="1rem" /> : null}
                disabled={loading}>
                  {'New Test'}
              </Button>
              }
              
                {isNewExperiment &&
                <Button 
                  variant="contained" 
                  style={{marginLeft:'30px'}}
                  color="primary" 
                  onClick={saveExperiment}
                  startIcon={loading ? <CircularProgress size="1rem" /> : null}
                  disabled={loading}>
                    {'Save Test'}
                </Button>
                }
        </Typography>        
          <Card>
              <Box
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography component="span" variant="subtitle1">
                    {'Showing'}:
                  </Typography>{' '}
                  <b>{paginatedTests.length}</b> <b>{'results of total '}{userExperiments.length}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={userExperiments.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            <Divider />

            {paginatedTests.length === 0 ? (
              <>
                <Typography
                  sx={{ py: 10 }}
                  variant="h3"
                  fontWeight="normal"
                  color="text.secondary"
                  align="center"
                >
                  {
                    "We couldn't find any test results"
                  }
                </Typography>
              </>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{'URL'}</TableCell>
                        <TableCell>{'TIME RUNNING'}</TableCell>
                        <TableCell>{'Progress'}</TableCell>
                        <TableCell>{'Status'}</TableCell>
                        <TableCell align="center">{'Actions'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedTests.map((test) => {
                        const isProjectSelected = selectedItems.includes(
                          test._id
                        );
                        return (
                          <TableRow
                            hover
                            key={test._id}
                            selected={isProjectSelected}
                          >
                            <TableCell>
                              <Typography noWrap variant="h5">
                                <Link href={'/domain/details/'+domain._id+'/'+test._id}>{test.name}</Link>
                              </Typography>
                            </TableCell>
                            
                            <TableCell>
                              <Typography
                                noWrap
                                variant="subtitle1"
                                color="text.primary"
                              >
                                {'Due'}
                                <b>
                                  2021
                                </b>
                              </Typography>
                              <Typography noWrap color="text.secondary">
                                {'Started'}:{' '}
                                {'2020'}
                              </Typography>
                            </TableCell>
                            
                            <TableCell align="center">
                              <Box
                                sx={{ minWidth: 175 }}
                                display="flex"
                                alignItems="center"
                              >
                                <LinearProgress
                                  sx={{ flex: 1, mr: 1 }}
                                  value={50}
                                  color="primary"
                                  variant="determinate"
                                />
                                <Typography variant="subtitle1">
                                  50%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography noWrap>
                                {'Completed'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography noWrap>
                                <Tooltip title={'Edit'} arrow>
                                  <IconButton color="primary">
                                    <EditTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={'Delete'} arrow>
                                  <IconButton
                                    onClick={()=>handleConfirmDelete(test._id)}
                                    color="primary"
                                  >
                                    <DeleteTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box p={2}>
                  <TablePagination
                    component="div"
                    count={userExperiments.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 15]}
                  />
                </Box>
              </>
            )}
          </Card>

        <DialogWrapper
          open={openConfirmDelete}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Transition}
          keepMounted
          onClose={closeConfirmDelete}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            p={5}
          >
            <AvatarError>
              <CloseIcon />
            </AvatarError>

            <Typography align="center" sx={{ pt: 4, px: 6 }} variant="h1">
              {t('Do you really want to delete this project')}?
            </Typography>

            <Typography
              align="center"
              sx={{ pt: 2, pb: 4, px: 6 }}
              fontWeight="normal"
              color="text.secondary"
              variant="h3"
            >
              {t("You won't be able to revert after deletion")}
            </Typography>

            <Box>
              <Button
                variant="text"
                size="large"
                sx={{ mx: 1 }}
                onClick={closeConfirmDelete}
              >
                {t('Cancel')}
              </Button>
              <ButtonError
                onClick={()=>handleDeleteCompleted(modalDomain)}
                size="large"
                sx={{ mx: 1, px: 3 }}
                variant="contained"
              >
                {t('Delete')}
              </ButtonError>
            </Box>
          </Box>
        </DialogWrapper>
        </>
      )}
      
      
      {(iframeOpened && domain) && (
        <div className="col-md-12 iframe" style={{width:'100%'}}>
            <IFrame url={`${Config.BACKEND}/${domain.directory}`} onClose={onClose} makeWinner={false} domain={domain} variantId=''></IFrame>
        </div>

      )}
    </>
  );
};

function Result() {
  return (
      <Provider store={store}>
          <ResultContent/>
      </Provider>
  )
} 
export default Result;
function enqueueSnackbar(arg0: any, arg1: { variant: string; anchorOrigin: { vertical: string; horizontal: string; }; TransitionComponent: (props: import("@material-ui/core").ZoomProps) => JSX.Element; }) {
  throw new Error('Function not implemented.');
}

