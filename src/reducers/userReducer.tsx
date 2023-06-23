import { SET_PREFERENCES } from "../actions/actionTypes";

interface UserPreferencesI {
    userPreferences: Array<any>,
}

const initialState = {
    userPreferences: []
}

const userReducer = (state: UserPreferencesI = initialState, action: { type: string; payload: any; }): UserPreferencesI => {
    switch (action?.type) {
        case SET_PREFERENCES:
            return {
                ...state,
                userPreferences: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;
