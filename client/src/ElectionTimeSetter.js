import React, { useState,useEffect,Fragment } from 'react'
import {connect} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ComposeComp from './ComposeComp'
import DisplayErrorMessage from './DisplayErrorMessage'
import './DisplayErrorMessage.css'
import './ElectionTimeSetter.css'
import {timerIsEnabled,timerIsDisabled,liveTimerIsEnabled,liveTimerIsDisabled,resetTimer} from './actions/timerActions'

function ElectionTimeSetter({adminAuthenticated,enableTimer,disableTimer,enableLiveTimer,disableLiveTimer,timer,resetTimer}) {

    const[startDate,setStartDate] = useState('')
    const[startTime,setStartTime] = useState('')
    const[endDate,setEndDate] = useState('')
    const[endTime,setEndTime] = useState('')  
    const[enableDone,SetEnableDone] = useState(false)
    const[alert,setAlert] = useState({isSet:false})
    const[electionStartDate,setElectionStartDate] = useState(0)
    const[electionEndDate,setElectionEndDate] = useState(0)
    const navigate = useNavigate()

    useEffect(()=>{
        const getTimerStatus = async ()=>{
            const {data:timerStatus} = await axios.get('https://votingapp-pmev.onrender.com/timer/status')
            console.log(timerStatus)
            if(timerStatus.isEmpty){
              disableTimer()
              disableLiveTimer()
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
    },[enableTimer,disableTimer,enableLiveTimer,disableLiveTimer])

    useEffect(() => { 
        let timeout
        const errorHandler = (msg)=>{
            SetEnableDone(false)
            setAlert({isSet:true,msg,status:'failed'})
            timeout = setTimeout(()=>{
                setAlert({isSet:false})
            },5000)
        }
        if(startDate && startTime && endDate && endTime){
            
            const startDateMilliseconds = startDate.split('-')
            const startDateMillisecondsTuned = startDateMilliseconds.map((v,i)=>{
                if(i === 1){
                    return +v - 1
                }
                else{
                    return +v
                }
            })
            const startTimeMilliseconds = startTime.split(':')
            const startTimeMillisecondsTuned = startTimeMilliseconds.map(v=>+v)
            const startTimeStamp = new Date(...startDateMillisecondsTuned,...startTimeMillisecondsTuned).getTime()

            const endDateMilliseconds = endDate.split('-')
            const endDateMillisecondsTuned = endDateMilliseconds.map((v,i)=>{
                if(i === 1){
                    return +v - 1
                }
                else{
                    return +v
                }
            })
            const endTimeMilliseconds = endTime.split(':')
            const endTimeMillisecondsTuned = endTimeMilliseconds.map(v=>+v)
            const endTimeStamp = new Date(...endDateMillisecondsTuned,...endTimeMillisecondsTuned).getTime()
            

            if(startTimeStamp<Date.now()){
                errorHandler('Election Date Should Not Be Set To The Past')
            }
            else if(endTimeStamp - startTimeStamp >= 0){
                SetEnableDone(true)
                setElectionStartDate(startTimeStamp)
                setElectionEndDate(endTimeStamp)
            }
            else{
                errorHandler('End Date Is Lesser Than Start Date') 
            }
        }

        return ()=>{
            clearTimeout(timeout)
        }

    }, [startDate,startTime,endDate,endTime])

    const handleSetStartDate = (e)=>{
        setStartDate(e.target.value)
    }

    const handleSetStartTime = (e)=>{
        setStartTime(e.target.value)
    }
    
    const handleSetEndDate = (e)=>{
        setEndDate(e.target.value)
    }

    const handleSetEndTime = (e)=>{
        setEndTime(e.target.value)
    }

    const handleTimerMessage = (msg,status)=>{
        SetEnableDone(false)
        setAlert({status,msg,isSet:true})
         setTimeout(()=>{
            setAlert({isSet:false})
            navigate('/')
        },3000)
    }

    const setTimer = async ()=>{
        const timerObj = {startDate:electionStartDate,endDate:electionEndDate}
        try {
           const{data:{message}} = await axios.post('https://votingapp-pmev.onrender.com/timer/set',timerObj,{headers:{
                'Content-Type':'application/json',
                'X-Auth-Token':localStorage.getItem('token')
            }
            })
            if(message === 'timer set'){
                enableTimer({...timerObj,electionStartSet:true})
                enableLiveTimer({electionEndSet:true})
                handleTimerMessage('Timer Successfully Set!','success') 
            }
            else{
                handleTimerMessage('Timer Could Not Be Set!','failed')
            }

        } catch (error) {
            console.log(error.message)
            handleTimerMessage('Timer Not Set!','failed')
        }

    }

    const cancelTimer = async ()=>{
        try {
            const{data:{message}} = await axios.get('https://votingapp-pmev.onrender.com/timer/cancel',{headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'X-Auth-Token':localStorage.getItem('token')
              }})
              console.log(message)
            if(message === 'timer cancelled'){
                resetTimer()
                handleTimerMessage('Timer Successfully Cancelled!','success')
            }
            else{
                handleTimerMessage('Timer Could Not Be Cancelled!','failed')
            }
            
        } catch (error) {
            console.log(error.message)
            handleTimerMessage('Timer Cancelled!','failed')
        }
        
    }

    if(adminAuthenticated){
        return (
            <ComposeComp linearGrad = 'linear-gradient(to right, rgb(135 243 135), rgb(227 247 119), rgb(101 223 251))'>
                    <Fragment>
                        <div className = "elemWrap">
                        {alert.isSet && <DisplayErrorMessage status = {alert.status}>{alert.msg}</DisplayErrorMessage>}
                            <div><label>Election Start Day:</label> <input type = 'date' onChange = {handleSetStartDate} value = {startDate}></input></div>
                            <div><label>Election Start Time:</label> <input type = 'time' onChange = {handleSetStartTime} value = {startTime}></input></div>
                            <div><label>Election End Day:</label> <input type = 'date' onChange = {handleSetEndDate} value = {endDate}></input></div>
                            <div><label>Election End Time:</label> <input type = 'time' onChange = {handleSetEndTime} value = {endTime}></input></div>
                        </div>
                        {enableDone && <button value = 'Done' className = "doneBtn timerBtns" onClick = {setTimer}>Done</button>}
                        {timer.electionStartSet && timer.electionEndSet && <button value = 'Cancel Timer' className = "cancelTimerBtn timerBtns" onClick = {cancelTimer}>Cancel Timer</button>}
                    </Fragment>
            </ComposeComp>

        )
    }
    else{
        navigate('/vote')
        return null
    }


}

const mapStateToProps = (state)=>({
    adminAuthenticated:state.admin.adminIsAuthenticated,
    timer:state.timer
  })

export default connect(mapStateToProps,{enableTimer:timerIsEnabled,disableTimer:timerIsDisabled,enableLiveTimer:liveTimerIsEnabled,disableLiveTimer:liveTimerIsDisabled,resetTimer})(ElectionTimeSetter) 
