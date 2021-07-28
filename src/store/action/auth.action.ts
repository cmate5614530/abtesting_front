import { userService } from "src/services";
import { SAVE_LOGIN, DESTROY_LOGIN, SAVE_USER } from "../type";

 const saveLogin = (data) => ({
    type: SAVE_LOGIN,
    payload: data
})

 const saveProfile = (data) => ({
    type: SAVE_USER,
    payload: data
})

 const destroyLogin = () => ({
    type: DESTROY_LOGIN
})

 const refreshProfile = () => ( async (dispatch) => {
    const response = await userService.me();
    dispatch(response.data.data ? saveProfile(response.data.data) : destroyLogin())
})
export {saveLogin, saveProfile, destroyLogin, refreshProfile}