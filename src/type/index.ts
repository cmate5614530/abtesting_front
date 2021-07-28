
/**========================================================================
 * *                                Redux Action Types
 *========================================================================**/

 export const REDUX_ACTION = '[REDUX ACTION]: ';


 /**========================================================================
  **                            Authentication
 *========================================================================**/
  export const SAVE_LOGIN = `${REDUX_ACTION} Save User login and token to redux`;
  export const SAVE_USER = `${REDUX_ACTION} Save User information to redux`;
  export const DESTROY_LOGIN = `${REDUX_ACTION} Destroy User token and info from redux`;
 
  
 
 /**========================================================================
  **                            Domain
 *========================================================================**/
  export const SAVE_DOMAIN = `${REDUX_ACTION} Save Domain`;
  export const CHANGE_ACTIVITY_DOMAIN = `${REDUX_ACTION} CHANGE_ACTIVITY Domain`;
 
 /**========================================================================
  **                            Domain
 *========================================================================**/
  export const FETCH_PLANS = `${REDUX_ACTION} Fetch Plans`;
  export const SAVE_PLANS = `${REDUX_ACTION} Save Plans`;
  export const SELECT_PLAN = `${REDUX_ACTION} Selected Plan`;
 
 
 /**========================================================================
  **                            Experiment
 *========================================================================**/
 export const FETCH_USER_EXPERIMENTS = `${REDUX_ACTION} Fetch User Experiments`;
 export const FETCH_USER_EXPERIMENTS_SUCCESS = `${REDUX_ACTION} Fetch User Experiments Success`;
 export const SAVE_EXPERIMENT = `${REDUX_ACTION} Save Experiment`;
 export const SAVE_USER_EXPERIMENTS = `${REDUX_ACTION} Save User Experiments`;
 export const FETCH_EXPERIMENT_BY_ID = `${REDUX_ACTION} Fetch Experiment By Id`;
 export const FETCH_EXPERIMENT_BY_ID_SUCCESS = `${REDUX_ACTION} Fetch Experiment By Id Success`;
 export const CREATE_NEW_EXPERIMENT = `${REDUX_ACTION} Create new experiment`;
 export const CREATE_NEW_EXPERIMENT_SUCCESS = `${REDUX_ACTION} Create new experiment success`;
 export const SET_TEMPLATES_FOR_NEW_EXPERIMENT = `${REDUX_ACTION} Set templates for new experiment`;
 
 