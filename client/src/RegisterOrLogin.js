import React, { useState } from 'react'
import './RegisterOrLogin.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import DisplayErrorMessage from './DisplayErrorMessage'
import {connect} from 'react-redux'
import LiveTimer  from './LiveTimer'
import Result from './Result'
import {userAuthenticated,userNotAuthenticated} from './actions/userActions'
import { setUserInfo } from './actions/userInfoAction'
import {timerIsEnabled,timerIsDisabled,liveTimerIsEnabled,liveTimerIsDisabled} from './actions/timerActions'
import {loading,notLoading} from './actions/loadingActions'

function RegisterOrLogin ({grantAccess,denyAccess,setInfo,userInformation,timer,enableTimer,disableTimer,enableLiveTimer,disableLiveTimer,load,stopLoading,isLoading}){
const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [action,setAction] = useState("Register")
const[displayAlert,setDisplayAlert] = useState({display:false,cls:'',message:''})
const navigate = useNavigate()

async function handleSubmit(){
  try {
     const{data:{token}} = await axios.post(`/auth/${action.toLowerCase()}`,{username,password})
     localStorage.setItem('token',token)
     grantAccess()
      navigate('/vote')  
  } catch (error) {
    denyAccess()
    action === "Register"?setAlert('failed',`${username} username already exists.`):setAlert('failed',"Username or password is incorrect")
  }

}
const handleUsernameChange = (e)=>{
    setUsername(e.target.value)
}
const handlePasswordChange = (e)=>{
    setPassword(e.target.value)
}

const setAlert = (cls,message)=>{
  setDisplayAlert({display:true,cls,message})
  setTimeout(()=>{
    setDisplayAlert({display:false,cls:'',message:''})
  },5000)
}
return ( 
  <div className='container_div'>
    {displayAlert.display&& <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>}
    <h1>Demo School Alumni Voting App</h1>
    <div className='wrapper_div'>
      <h2>Time To Vote! <img src='images/vote.png' alt='vote icon'></img></h2>
      <div className='content_div'>
        <div className='register_login sizer'>
            <span id = {action === "Register"?'currentSelected':''} className='labelSelect' onClick={()=>setAction("Register")}>Register</span>
            <span id = {action === "Login"?'currentSelected':''} className='labelSelect' onClick={()=>setAction("Login")}>Login</span>        
        <div>
            <div className='input_box'>
              <label>Username</label>
              <input type={'text'} value = {username} onChange = {handleUsernameChange}></input>              
            </div>
            <div className='input_box'>
              <label>Password</label>
              <input type={'password'} value = {password} onChange = {handlePasswordChange}></input>              
            </div>
            <div className='action_btn'>
              <input type={'button'} value = {action} onClick = {handleSubmit} disabled = {!username || !password}></input>  
            </div>
        </div>
        
    </div>
    <div id='group_px' className='sizer'>
      <img src='images/group_px.png' alt='supporting voting'></img>
    </div>
      </div>
    </div>
    <footer style={{color:'white',paddingTop:'10px',marginBottom:'0px'}}>&copy; Corestack Tech {new Date().getFullYear()}</footer>
  </div> 
)
}

const mapStateToProps = (state)=>({
  userInformation:state.userInfo,
  timer:state.timer,
  isLoading:state.isLoading
})

export default connect(mapStateToProps,{grantAccess:userAuthenticated,denyAccess:userNotAuthenticated,setInfo:setUserInfo,enableTimer:timerIsEnabled,disableTimer:timerIsDisabled,enableLiveTimer:liveTimerIsEnabled,disableLiveTimer:liveTimerIsDisabled,load:loading,stopLoading:notLoading})(RegisterOrLogin);
