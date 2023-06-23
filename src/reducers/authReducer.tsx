interface AuthStateI {

}

const defaultAuthState: AuthStateI = {

};

const authReducer = (state: AuthStateI = defaultAuthState, action: any): AuthStateI => {
    return state;
}

export default authReducer;
