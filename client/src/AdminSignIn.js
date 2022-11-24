import React,{useState} from 'react'
import ComposeComp from './ComposeComp'
import DisplayErrorMessage from './DisplayErrorMessage'
import {resetTimer} from './actions/timerActions'
import {adminLogin} from './actions/adminActions'
import setAlert from './util/setAlert'
import {connect} from 'react-redux'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './AdminSignin.css'

function AdminSignIn({login,resetElection,resetTimer}) {
    const[password,setPassword] = useState('')
    const[username,setUsername] = useState('')
    const[errorMsg,setErrorMsg] = useState('')
    const navigate = useNavigate()
    const[displayAlert,setDisplayAlert] = useState({display:false,cls:'',message:''})

    const handleSetUsername = (e)=>{
         setUsername(e.target.value)
    }  

    const handleSetPassword = (e)=>{
          setPassword(e.target.value)
    }

    const adminLogin = async ()=>{
        const alumniInfo = {username,password}
        try {
            const {data:{token}} = await axios.post('https://votingapp-pmev.onrender.com/auth/login',alumniInfo)
            if(token){
                localStorage.setItem('token',token)
            }
            else{
                setErrorMsg('Invalid Login Credentials!')
            }
            const data = await login()
            
            if(data === 'success'){
                if(resetElection){
                    try {
                         await axios.delete('https://votingapp-pmev.onrender.com/election/delete',{headers:{
                            'Accept':'application/json',
                            'Content-Type':'application/json',
                            'X-Auth-Token':localStorage.getItem('token')
                        }})  
                        setAlert('success','Election Successfully Ended!!!',setDisplayAlert)
                        setTimeout(()=>{
                            resetTimer()
                            navigate('/')
                        },6000)
                    } catch (error) {
                        setAlert('failed','Oops Something Went Wrong!!!',setDisplayAlert)
                    }

                }
                else{
                  navigate('/admin')   
                }
                
            }
            else{
                setErrorMsg('Only An Administrator Can Login!')
            }
        } catch (error) {
            setErrorMsg('Only An Administrator Can Login!')
        }
    }
    return (
        <ComposeComp>
            <div className = 'admin_signin_Wrap'>
            {displayAlert.display && <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>}   
            <h2>Admin Sign In</h2>
            <div><label>Username:</label> <input type = 'text' onChange = {handleSetUsername} value = {username} className = 'admin_input'></input></div>   
            <div><label>Password:</label> <input type = 'password' onChange = {handleSetPassword} value = {password} className = 'admin_input'></input></div>
            </div>
            {username && password && <button value = 'Login' className = "adminLogin_btn" onClick = {adminLogin}>Login</button>}
            {errorMsg && <div className = 'errorAdmin'>{errorMsg}</div>}
        </ComposeComp>
    )
}

const mapStateToProps = (state)=>({
    adminAuthenticated:state.admin.adminIsAuthenticated
})

export default connect(mapStateToProps,{login:adminLogin,resetTimer})(AdminSignIn) 
