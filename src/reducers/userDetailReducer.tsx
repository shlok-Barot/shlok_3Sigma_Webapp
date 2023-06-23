import { SET_USER_DETAILS } from "../actions/actionTypes";

interface UserDetailsI {
    userDetails: Array<any>,
}

const initialState = {
    userDetails: []
}

const userDetailReducer = (state: UserDetailsI = initialState, action: { type: string; payload: any; }): UserDetailsI => {
    switch (action?.type) {
        case SET_USER_DETAILS:
            return {
                ...state,
                userDetails: action.payload
            }
        default:
            return state;
    }
}

export default userDetailReducer;
