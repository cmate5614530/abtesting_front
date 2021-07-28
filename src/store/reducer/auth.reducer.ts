import { DESTROY_LOGIN, SAVE_LOGIN, SAVE_USER } from "../type";

const initialState = { access_token: null, user: {}, isLoggedIn: false }
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_LOGIN:
            return {...state, ...action.payload, isLoggedIn: true }
        case SAVE_USER:
            return {...state, user: action.payload}
        case DESTROY_LOGIN:
            return {...initialState};
        default:
            return state;
    }
}