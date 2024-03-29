import axios from 'axios'
import {LOADING,NOT_LOADING,ADMIN_AUTH_SUCCESS,ADMIN_AUTH_FAILURE} from './constants/constants'
export const adminLogin = ()=> async(dispatch)=>{
   
   dispatch({
      type:LOADING
   })
   try {
         const {data:{authenticated}} = await axios.get('https://votingapp-pmev.onrender.com/auth/admin/login',{headers:{
         'Accept':'application/json',
         'Content-Type':'application/json',
         'X-Auth-Token':localStorage.getItem('token')
      }}) 
      dispatch({type:NOT_LOADING})
      const action = authenticated?ADMIN_AUTH_SUCCESS:ADMIN_AUTH_FAILURE

      dispatch({
         type:action
      })  
         if(authenticated){
            return 'success'
         }
         else{
            return 'failure'
         }
      
   } catch (error) {
      console.log(error.message)
      return Promise.reject('failure')
   }

}


