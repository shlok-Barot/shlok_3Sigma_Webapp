import { SET_LOGID } from "../actions/actionTypes"

interface InitialStateI {
    logId: string,
}

const initialState = {
    logId: ''
}

const getLogIdReducer = (state: InitialStateI = initialState, action: { type: any, payload: string }): InitialStateI => {
    switch(action.type) {
        case SET_LOGID:
            return {
                ...state,
                logId: action.payload
            }
        default:
            return state;
    }
}

export default getLogIdReducer;
