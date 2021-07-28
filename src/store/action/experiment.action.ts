import { experimentService } from "../../services";
import {
  CREATE_NEW_EXPERIMENT,
  CREATE_NEW_EXPERIMENT_SUCCESS,
  FETCH_EXPERIMENT_BY_ID_SUCCESS,
  FETCH_USER_EXPERIMENTS,
  FETCH_USER_EXPERIMENTS_SUCCESS,
  SAVE_USER_EXPERIMENTS,
  SET_TEMPLATES_FOR_NEW_EXPERIMENT,
} from "../type";

 const saveExperiments = (data) => ({
  type: SAVE_USER_EXPERIMENTS,
  payload: data,
});

 const fetchUserExperiments = () => ({
  type: FETCH_USER_EXPERIMENTS,
});

 const fetchUserExperimentsSuccess = (data) => ({
  type: FETCH_USER_EXPERIMENTS_SUCCESS,
  payload: data,
});

 const saveExperiment = (data) => ({
  type: FETCH_EXPERIMENT_BY_ID_SUCCESS,
  payload: data,
});

 const createNewExperiment = () => ({
  type: CREATE_NEW_EXPERIMENT,
});

 const fetchExperimentById = (id) => async (dispatch) => {
  const response = await experimentService.getById(id);
  dispatch(saveExperiment(response.data.data));
};

 const setTemplatesForNewExperiment = (data) => {
  console.log("Template Data, ", data);
  return {
    type: SET_TEMPLATES_FOR_NEW_EXPERIMENT,
    payload: data,
  };
};

 const createNewExperimentSuccess = () => ({
  type: CREATE_NEW_EXPERIMENT_SUCCESS,
});

 const fetchExperiments = (domain) => async (dispatch) => {
  dispatch(fetchUserExperiments());
  const response = await experimentService.getUserExperiments(domain);
  // dispatch(saveExperiments(response.data.data));
  dispatch(fetchUserExperimentsSuccess(response.data.data));
};

export {saveExperiments, fetchUserExperiments, fetchUserExperimentsSuccess, saveExperiment, createNewExperiment, fetchExperimentById,setTemplatesForNewExperiment, createNewExperimentSuccess, fetchExperiments}