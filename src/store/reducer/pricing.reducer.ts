import { SAVE_PLANS, SELECT_PLAN, FETCH_PLANS } from "../type";

const initialState = {
    plans: [],
    selectedPlan: null,
    loading: false
}
export const pricingReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PLANS:
            return {...state, loading: true }
        case SAVE_PLANS:
            return {...state, plans: action.payload, loading: false }
            case SELECT_PLAN:
                return {...state, selectedPlan: action.payload }
        default:
            return state;
    }
}