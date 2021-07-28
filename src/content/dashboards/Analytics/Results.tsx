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
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  Link,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  LinearProgress,
  TextField,
  Button,
  Typography,
  Dialog,
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
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { useSnackbar } from 'notistack';
import { formatDistance, format } from 'date-fns';
import Text from 'src/components/Text';

import { domainService } from 'src/services';
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

const CardWrapper = experimentalStyled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
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

const IconButtonError = experimentalStyled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.75)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
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
  projects: Project[],
  page: number,
  limit: number
): Project[] => {
  return projects.slice(page * limit, page * limit + limit);
};

const Results: FC<ResultsProps> = ({ projects, ...rest }) => {
  const [selectedItems, setSelectedProjects] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const [domainUrl, setDomainUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [domains, setDomains] = useState([]);

  const projectTags = [
    { title: 'Development' },
    { title: 'Design Project' },
    { title: 'Marketing Research' },
    { title: 'Software' }
  ];

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'not_started',
      name: t('Not started')
    },
    {
      id: 'completed',
      name: t('Completed')
    },
    {
      id: 'in_progress',
      name: t('In Progress')
    }
  ];

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<{ value: unknown }>) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllProjects = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProjects(
      event.target.checked ? projects.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (
    event: ChangeEvent<HTMLInputElement>,
    projectId: string
  ): void => {
    if (!selectedItems.includes(projectId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProjects = domains;
  const paginatedProjects = applyPagination(domains, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProjects =
    selectedItems.length > 0 && selectedItems.length < projects.length;
  const selectedAllProjects = selectedItems.length === projects.length;

  const [toggleView, setToggleView] = useState<string | null>('table_view');

  const handleViewOrientation = (
    event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setToggleView(newValue);
  };

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
      setDomains(domains.filter(({ _id }) => _id !== id));
    }, error => {
        console.log(error);
    })
    
  };

  const onSubmit = () => {
     if (domainUrl.trim().length < 5) setError('Please input more than 5 letters') ;
     else{
       setLoading(true);
      domainService.fetchFromNode({ website: domainUrl }).then(({ data }) => {
        console.log('Data: ', data);
        // toast.info('Information retrieved.')
         saveDomain(data.url);
          // setDomainUrl('');
         setLoading(false)
      }, error => {
        console.log(error);
        // toast.error('Some error occurred, try again!')
         setLoading(false)
      })
     } 
  }

  const saveDomain = async (directory) => {
    const response = await domainService.saveDomainForUser({ domain: domainUrl, directory });
    console.log(response)
    await fetch();
  }

  useEffect(() => {
      fetch();
  }, [])

  const fetch = () => {
    setLoading(true);
    domainService.domainsForUser().then((response) => {
        setLoading(false);
        setDomains(response.data.data);
        console.log('---------', response.data.data);
    }, error => {
        setLoading(false)
    })
  }

  return (
    <>
      <h1>Add a New URL to Test</h1>
      <Card sx={{ p: 1, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            
            <Box p={1} display="flex">
            
              <TextField
                sx={{ mr: 1 }}
                error={Boolean(error)}
                helperText={error}
                label={'Input URL'}
                placeholder={'e.g. https://google.com'}
                value={domainUrl}
                onChange={e=>{setDomainUrl(e.target.value);setError('');}}
                fullWidth
                variant="outlined"
                
              />
              <Button 
                variant="contained" 
                style={{width:'170px',height:'53px'}} 
                color="primary" 
                onClick={onSubmit} 
                startIcon={loading ? <CircularProgress size="1rem" /> : null}
                disabled={loading}>
                  {'Begin Test'}
              </Button>
            </Box>
          </Grid>
          
        </Grid>
      </Card>
      <h1>Current Tests</h1>          
      {toggleView === 'table_view' && (
        <Card>
          {selectedBulkActions && (
            <Box p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Showing')}:
                </Typography>{' '}
                <b>{paginatedProjects.length}</b> <b>{'results of total '}{domains.length}</b>
              </Box>
              <TablePagination
                component="div"
                count={filteredProjects.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
          <Divider />

          {paginatedProjects.length === 0 ? (
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
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllProjects}
                          indeterminate={selectedSomeProjects}
                          onChange={handleSelectAllProjects}
                        />
                      </TableCell> */}
                      <TableCell>{'URL'}</TableCell>
                      <TableCell>{'TIME RUNNING'}</TableCell>
                      <TableCell>{t('Progress')}</TableCell>
                      <TableCell>{t('Status')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProjects.map((project) => {
                      const isProjectSelected = selectedItems.includes(
                        project._id
                      );
                      return (
                        <TableRow
                          hover
                          key={project._id}
                          selected={isProjectSelected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </TableCell> */}
                          <TableCell>
                            <Typography noWrap variant="h5">
                              <Link href={'/domain/details/'+project._id}>{project.href}</Link>
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Typography
                              noWrap
                              variant="subtitle1"
                              color="text.primary"
                            >
                              {t('Due')}
                              <b>
                                2021
                                {/* {' '}
                                {formatDistance(
                                  project.startDate,
                                  project.dueDate,
                                  { addSuffix: true }
                                )} */}
                              </b>
                            </Typography>
                            <Typography noWrap color="text.secondary">
                              {t('Started')}:{' '}
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
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={()=>handleConfirmDelete(project._id)}
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
                  count={filteredProjects.length}
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
      )}
      {toggleView === 'grid_view' && (
        <>
          {paginatedProjects.length !== 0 && (
            <Card sx={{ p: 2, mb: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <>
                  <Box display="flex" alignItems="center">
                    <Tooltip
                      arrow
                      placement="top"
                      title={t('Select all projects')}
                    >
                      <Checkbox
                        checked={selectedAllProjects}
                        indeterminate={selectedSomeProjects}
                        onChange={handleSelectAllProjects}
                      />
                    </Tooltip>
                  </Box>
                  {selectedBulkActions && (
                    <Box flex={1} pl={2}>
                      <BulkActions />
                    </Box>
                  )}
                  {!selectedBulkActions && (
                    <TablePagination
                      component="div"
                      count={filteredProjects.length}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleLimitChange}
                      page={page}
                      rowsPerPage={limit}
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                  )}
                </>
              </Box>
            </Card>
          )}
          {paginatedProjects.length === 0 ? (
            <Typography
              sx={{ py: 10 }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any projects matching your search criteria")}
            </Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProjects.map((project) => {
                  const isProjectSelected = selectedItems.includes(project.id);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={project.name}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isProjectSelected
                        })}
                      >
                        <Box sx={{ position: 'relative', zIndex: '2' }}>
                          <Box
                            pl={2}
                            py={1}
                            pr={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography component="span">
                                <b>{t('Tags')}:</b>{' '}
                              </Typography>
                              {project.tags.map((value) => {
                                return (
                                  <span key={value}>
                                    <Link href="#">{value}</Link>,{' '}
                                  </span>
                                );
                              })}
                            </Box>
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </Box>
                          <Divider />
                          <CardMedia
                            sx={{ minHeight: 180 }}
                            image={project.screenshot}
                          />
                          <Divider />
                          <Box p={2}>
                            {getProjectStatusLabel(project.status)}

                            <Typography
                              sx={{ mt: 2 }}
                              variant="h4"
                              gutterBottom
                            >
                              {project.name}
                            </Typography>

                            <Typography noWrap variant="subtitle2">
                              {project.description}
                            </Typography>
                          </Box>
                          <Box
                            px={2}
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Started')}:{' '}
                              </Typography>
                              <Typography variant="h5">
                                {format(project.dueDate, 'MMMM dd yyyy')}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Due in')}:{' '}
                                <Text color="black">
                                  {formatDistance(
                                    project.startDate,
                                    project.dueDate,
                                    { addSuffix: true }
                                  )}{' '}
                                  days
                                </Text>
                              </Typography>
                            </Box>
                          </Box>

                          <Box px={2} pb={2} display="flex" alignItems="center">
                            <LinearProgress
                              sx={{ flex: 1, mr: 1 }}
                              value={project.progress}
                              color="primary"
                              variant="determinate"
                            />
                            <Typography variant="subtitle1">
                              {project.progress}%
                            </Typography>
                          </Box>
                          <Divider />
                          <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" justifyContent="flex-start">
                              {project.memberIds.length > 0 && (
                                <AvatarGroup max={4}>
                                  {project.memberIds.map((member) => (
                                    <Tooltip
                                      arrow
                                      placement="top"
                                      key={member.id}
                                      title={member.name}
                                    >
                                      <Avatar
                                        sx={{ width: 30, height: 30 }}
                                        key={member.id}
                                        src={member.avatar}
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              )}
                            </Box>
                            <Box>
                              <Button
                                sx={{ mr: 1 }}
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                {t('Edit')}
                              </Button>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButtonError
                                  onClick={handleConfirmDelete}
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButtonError>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </CardWrapper>
                    </Grid>
                  );
                })}
              </Grid>
              <Card
                sx={{
                  p: 2,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography component="span" variant="subtitle1">
                    {t('Showing')}
                  </Typography>{' '}
                  <b>{limit}</b> {t('of')} <b>{filteredProjects.length}</b>{' '}
                  <b>{t('projects')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredProjects.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage=""
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Card>
            </>
          )}
        </>
      )}
      {!toggleView && (
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Typography
            align="center"
            variant="h4"
            fontWeight="normal"
            color="text.secondary"
            sx={{ my: 5 }}
            gutterBottom
          >
            {t(
              'Choose between table or grid views for displaying the projects list.'
            )}
          </Typography>
        </Card>
      )}

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
  );
};

Results.propTypes = {
  projects: PropTypes.array.isRequired
};

Results.defaultProps = {
  projects: []
};

export default Results;
