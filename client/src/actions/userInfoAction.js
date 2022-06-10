import {USER_INFO} from './constants/constants'

export const setUserInfo = (username)=>({
    type:USER_INFO,
    payload:{username}
}) 



