import { createSlice } from '@reduxjs/toolkit'

let token = localStorage.getItem('token')
let userdata = localStorage.getItem('userdata')
userdata = userdata ? JSON.parse(userdata) : {} 

const AuthSlice = createSlice({
    name: 'user',
    initialState: {
        token: token ? token : null,
        userdata: userdata ? userdata : {}
    },
    reducers: {
        logIn(state, actions) {
            state.token = actions.payload.token
            state.userdata = actions?.payload?.user ? JSON.parse(JSON.stringify(actions.payload.user)) : {}
            localStorage.setItem('userdata', JSON.stringify(actions.payload.user))
            localStorage.setItem('token', JSON.stringify(actions.payload.token))
        },
        updateUserData(state, actions) { 
            const oldData = JSON.parse(JSON.stringify( state.userdata ))
            const newData = actions.payload
            state.userdata = {...oldData, ...newData}
            localStorage.setItem('userdata', JSON.stringify({...oldData, ...newData})) 
        },
        logOut(state) {
            state.token = null
            state.userdata = {}
            localStorage.removeItem('userdata')
            localStorage.removeItem('token')
        },
    }
})

export const { logIn, logOut, updateUserData } = AuthSlice.actions;
export default AuthSlice;
