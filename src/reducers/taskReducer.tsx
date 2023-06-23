import { SET_TASKS } from "../actions/actionTypes";

interface TasksI {
    tasks: Array<any>
}
const initialState = {
    tasks: []
}

const taskReducer = (state: TasksI = initialState, action: { type: string; payload: Array<any>; }): TasksI => {
    switch (action?.type) {
        case SET_TASKS:
            return {
                ...state,
                tasks: action?.payload
            }
        default:
            return state;
    }
}

export default taskReducer;
