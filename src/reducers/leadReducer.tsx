import { SET_LEADS } from "../actions/actionTypes";

interface LeadStateI {
    leads: any,
    isLoading: boolean
}

const leadsInitialState = {
    leads: [],
    isLoading: true,
}

const leadReducer = (state: LeadStateI = leadsInitialState, action: { type: string; payload: any; }): LeadStateI => {
    switch(action.type) {
        case SET_LEADS:
            return {
                ...state,
                leads: action.payload,
                isLoading: false
            }
        default:
            return state;
    }
}

export default leadReducer;
