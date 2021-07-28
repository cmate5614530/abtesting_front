import {
    FETCH_EXPERIMENT_BY_ID,
    FETCH_USER_EXPERIMENTS,
    FETCH_USER_EXPERIMENTS_SUCCESS,
    SAVE_USER_EXPERIMENTS,
    SAVE_EXPERIMENT,
    FETCH_EXPERIMENT_BY_ID_SUCCESS,
    CREATE_NEW_EXPERIMENT,
    CREATE_NEW_EXPERIMENT_SUCCESS,
    SET_TEMPLATES_FOR_NEW_EXPERIMENT
  } from "../type";
  
  const initialState = {
    userExperiments: [],
    experiment: null,
    isNewExperiment: false,
    loading: false,
    newTemplates: []
  };
  export const experimentReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_USER_EXPERIMENTS:
        return { ...state, userExperiments: [...action.payload] };
      case SAVE_EXPERIMENT:
        return { ...state, experiment: action.payload };
      case FETCH_USER_EXPERIMENTS:
        return { ...state, loading: true };
      case FETCH_EXPERIMENT_BY_ID:
        return { ...state, loading: true };
      case FETCH_USER_EXPERIMENTS_SUCCESS:
        return { ...state, loading: false, userExperiments: [...action.payload] };
      case FETCH_EXPERIMENT_BY_ID_SUCCESS:
          return {...state, experiment: action.payload}
      case CREATE_NEW_EXPERIMENT:
          return {...state, isNewExperiment: true}
      case CREATE_NEW_EXPERIMENT_SUCCESS:
          return {...state, isNewExperiment: false, newTemplates: []}
      case SET_TEMPLATES_FOR_NEW_EXPERIMENT:
          return {...state, newTemplates: [...state.newTemplates ,action.payload]}
      
      default:
        return state;
    }
  };
  