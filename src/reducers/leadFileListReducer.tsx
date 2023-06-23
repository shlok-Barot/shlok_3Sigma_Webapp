import { SET_LEADFILELIST } from "../actions/actionTypes";

interface LeadFileListI {
    leadFile: Array<any>,
}

const initialState = {
    leadFile: []
}

const leadFileListReducer = (state: LeadFileListI = initialState, action: { type: string; payload: any; }): LeadFileListI => {
    switch (action?.type) {
        case SET_LEADFILELIST:
            return {
                ...state,
                leadFile: action.payload
            }
        default:
            return state;
    }
}

export default leadFileListReducer;
