import { SET_ACTIVITIES } from "../actions/actionTypes";

interface ActivityI {
    activities: Array<any>
}
const initialState = {
    activities: []
}

const activityReducer = (state: ActivityI = initialState, action: { type: string; payload: any; }): ActivityI => {
    switch(action?.type) {
        case SET_ACTIVITIES:
            return {
                ...state,
                activities: action?.payload
            }
        default:
            return state;
    }
}

export default activityReducer;
