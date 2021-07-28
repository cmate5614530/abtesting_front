import { domainService } from "../../services";
import { CHANGE_ACTIVITY_DOMAIN, SAVE_DOMAIN } from "../type";

 const saveDomain = (data) => ({
    type: SAVE_DOMAIN,
    payload: data
})

 const changeVariantActivity = (data) => ({
    type: CHANGE_ACTIVITY_DOMAIN,
    payload: data
})

 const viewDomainAction = (id) => ( async (dispatch) => {
    const response = await domainService.domainDetails(id);
    dispatch(saveDomain(response.data.data))
})
export {saveDomain, changeVariantActivity, viewDomainAction}