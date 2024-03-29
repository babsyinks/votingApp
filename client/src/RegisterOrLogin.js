import React, { useState,useEffect } from 'react'
import './RegisterOrLogin.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import DisplayErrorMessage from './DisplayErrorMessage'
import setAlert from './util/setAlert';
import {connect} from 'react-redux'
import LiveTimer  from './LiveTimer'
import Result from './Result'
import TimerComp from './TimerComp'
import ComposeComp from './ComposeComp'
import {userAuthenticated,userNotAuthenticated} from './actions/userActions'
import { setUserInfo } from './actions/userInfoAction'
import {timerIsEnabled,timerIsDisabled,liveTimerIsEnabled,liveTimerIsDisabled} from './actions/timerActions'
import {loading,notLoading} from './actions/loadingActions'

function RegisterOrLogin ({grantAccess,denyAccess,setInfo,timer,enableTimer,disableTimer,enableLiveTimer,disableLiveTimer,load,stopLoading,isLoading}){
const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [action,setAction] = useState("Register")
const[displayAlert,setDisplayAlert] = useState({display:false,cls:'',message:''})
const navigate = useNavigate()

useEffect(()=>{
  const getTimerStatus = async ()=>{
    const {data:timerStatus} = await axios.get('https://votingapp-pmev.onrender.com/timer/status')
    if(timerStatus.isEmpty){
      disableTimer()
      disableLiveTimer()
    }
    else if(!timerStatus.startDate && !timerStatus.endDate){
      //handle election result
      disableTimer(timerStatus)
      disableLiveTimer()
    }
    else if(!timerStatus.startDate){
      disableTimer()
      enableLiveTimer({...timerStatus,electionEndSet:true})
    }
    else if(timerStatus.message){
      console.log(timerStatus.message)
    }
    else{
      enableTimer({...timerStatus,electionStartSet:true})
      enableLiveTimer({electionEndSet:true})
    }
    
  }

  getTimerStatus()
  
},[enableTimer,disableTimer,enableLiveTimer,disableLiveTimer,load,stopLoading])

async function handleSubmit(){
  try {
    load()
     const{data:{token}} = await axios.post(`https://votingapp-pmev.onrender.com/auth/${action.toLowerCase()}`,{username,password})
     localStorage.setItem('token',token)
     setInfo(username)
     grantAccess()
     stopLoading() 
     navigate('/vote')  
  } catch (error) {
    denyAccess()
    stopLoading() 
    action === "Register"?setAlert('failed',`${username} username already exists.`,setDisplayAlert):setAlert('failed',"Username or password is incorrect",setDisplayAlert)
  }

}
const handleUsernameChange = (e)=>{
    setUsername(e.target.value)
}
const handlePasswordChange = (e)=>{
    setPassword(e.target.value)
}

  if(timer.electionStartSet){
      return (
            <ComposeComp>
              <h2 className = "eleMsg_start">The Election Will Start In:</h2>
                <TimerComp endTime = {timer.startDate}></TimerComp>
              <h2 className = "eleMsg_cb">Please Come Back To Vote By Then.</h2>
            </ComposeComp>
        );
  }
  else if(!timer.electionStartSet && !timer.electionEndSet && timer.startDate === null && timer.endDate === null){
    return <Result />
  }
  else{
    return ( 
      <div className='container_div'>
        {displayAlert.display&& <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>}
        {timer.electionEndSet && <LiveTimer electionEndTime = {timer.endDate} />}
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
                  <button onClick = {handleSubmit} disabled = {!username || !password}>{isLoading?<i className="fas fa-circle-notch fa-spin fa-xs"></i>:action}</button>  
                </div>
            </div>
        </div>
        <div id='group_px' className='sizer'>
          <img src='images/group_px.png' alt='supporting voting'></img>
        </div>
          </div>
        </div>
        <footer style={{color:'white'}}>&copy; Corestack Tech {new Date().getFullYear()}</footer>
      </div> 
    )
  }
}

const mapStateToProps = (state)=>({
  userInformation:state.userInfo,
  timer:state.timer,
  isLoading:state.isLoading
})

export default connect(mapStateToProps,{grantAccess:userAuthenticated,denyAccess:userNotAuthenticated,setInfo:setUserInfo,enableTimer:timerIsEnabled,disableTimer:timerIsDisabled,enableLiveTimer:liveTimerIsEnabled,disableLiveTimer:liveTimerIsDisabled,load:loading,stopLoading:notLoading})(RegisterOrLogin);
