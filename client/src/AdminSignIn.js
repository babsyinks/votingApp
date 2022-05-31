import React,{useState} from 'react'
import ComposeComp from './ComposeComp'
import './AdminSignin.css'
import {adminLogin} from './actions/adminActions'
import {connect} from 'react-redux'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function AdminSignIn({login,history}) {
    const[password,setPassword] = useState('')
    const[username,setUsername] = useState('')
    const[errorMsg,setErrorMsg] = useState('')
    const navigate = useNavigate()

    const handleSetUsername = (e)=>{
         setUsername(e.target.value)
    }  

    const handleSetPassword = (e)=>{
          setPassword(e.target.value)
    }

    const adminLogin = async ()=>{
        const alumniInfo = {username,password}
        try {
            const {data:{token}} = await axios.post('/auth/login',alumniInfo)
            if(token){
                localStorage.setItem('token',token)
            }
            else{
                setErrorMsg('Invalid Login Credentials!')
            }
            const data = await login()
            
            if(data === 'success'){
                navigate('/admin') 
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
    adminAuthenticated:state.admin.adminIsAuthenticated,
})

export default connect(mapStateToProps,{login:adminLogin})(AdminSignIn) 
