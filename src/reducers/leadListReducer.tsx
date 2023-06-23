import { SET_LEADS_LIST, SET_SELECTED_LEAD } from "../actions/actionTypes";

interface LeadListI {
    leadList: Array<any>,
    selectedLead: object,
}
const initialState = {
    leadList: [],
    selectedLead: {}
}

const leadListReducer = (state: LeadListI = initialState, action: { type: string; payload: any; }): LeadListI => {
    switch(action?.type) {
        case SET_LEADS_LIST:
            return {
                ...state,
                leadList: action?.payload
            }
        case SET_SELECTED_LEAD:
            return {
                ...state,
                selectedLead: action?.payload
            }
        default:
            return state;
    }
}

export default leadListReducer;
