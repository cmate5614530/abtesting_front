import { RootStateOrAny } from "react-redux";
import { CHANGE_ACTIVITY_DOMAIN, SAVE_DOMAIN } from "../type";

const initialState = {}
export const domainReducer = (state:RootStateOrAny = initialState, action) => {
    switch (action.type) {
        case SAVE_DOMAIN:
            return {...state, ...action.payload }
        case CHANGE_ACTIVITY_DOMAIN:
            const templates = state.templates.map(t => t._id !== action.payload.id ? t : {...t, isActive: action.payload.status});
            return {...state, templates }
        default:
            return state;
    }
}