import { SET_NOTES } from "../actions/actionTypes";

interface NoteI {
    notes: Array<any>
}
const initialState = {
    notes: []
}

const noteReducer = (state: NoteI = initialState, action: { type: string; payload: Array<any>; }): NoteI => {
    switch(action?.type) {
        case SET_NOTES:
            return {
                ...state,
                notes: action?.payload
            }
        default:
            return state;
    }
}

export default noteReducer;
