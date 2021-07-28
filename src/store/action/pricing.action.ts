import { domainService, subscriptionService } from "src/services";
import {  FETCH_PLANS, SAVE_PLANS, SELECT_PLAN } from "../type";

 const savePlans = (data) => ({
    type: SAVE_PLANS,
    payload: data
})

 const fetchPlans = () => ({
    type: FETCH_PLANS
})

 const selectPlan = (plan) => ({
    type: SELECT_PLAN,
    payload: plan
})

 const fetchAllPlans = () => ( async (dispatch) => {
    const response = await subscriptionService.allPlans();
    dispatch(savePlans(response.data))
})
export {savePlans, fetchPlans, selectPlan, fetchAllPlans}