export const SET_AUTH_USER_DATA = "auth/SET_AUTH_USER_DATA"

const initialState = {
    isAuth: false
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_USER_DATA:
            return {
                ...state,
                ...action.payload,
                isAuth: action.isAuth
            }
        default:
            return state
    }
}