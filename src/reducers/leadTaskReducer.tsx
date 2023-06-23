import { SET_LEADTASK } from "../actions/actionTypes";

interface ActivityI {
    leadTask: Array<any>
}
const initialState = {
    leadTask: []
}

const leadTaskReducer = (state: ActivityI = initialState, action: { type: string; payload: any; }): ActivityI => {
    switch(action?.type) {
        case SET_LEADTASK:
            return {
                ...state,
                leadTask: action?.payload
            }
        default:
            return state;
    }
}

export default leadTaskReducer;
