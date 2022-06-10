import {USER_INFO} from '../actions/constants/constants'
const userInfoReducer = (state = {egcaNum:0,name:''},action)=>{
    switch(action.type){
        case USER_INFO:
            return {username:action.payload.username}

        default:
            return state
    }
}

export default userInfoReducer