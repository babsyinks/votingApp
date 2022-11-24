import React,{useState,useEffect} from 'react'
import DisplayErrorMessage from './DisplayErrorMessage'
import setAlert from './util/setAlert'
import axios from 'axios'
import {connect} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const Admin = ({adminAuthenticated})=>{
  const[surname,setSurname] = useState('')
  const[firstName,setFirstName] = useState('')
  const[post,setPost] = useState('President')  
  const[manifesto,setManifesto] = useState('')
  const[picture,setPicture] = useState('')
  let[resetFile,setResetFile] = useState(0)
  const[isDisabled,setIsDisabled] = useState(true)
  const[displayAlert,setDisplayAlert] = useState({display:false,cls:'',message:''})
  const navigate = useNavigate()

  useEffect(()=>{
    if(!adminAuthenticated){
      navigate('/')
    }
  },[adminAuthenticated,navigate])

  useEffect(()=>{
    if(surname&&firstName&&post&&manifesto&&picture){
      setIsDisabled(false)
    }
    else{
      setIsDisabled(true)
    }

  },[surname,firstName,post,manifesto,picture])

  const onSetSurname = (e)=>{
    setSurname(e.target.value)
  }
  const onSetFirstName = (e)=>{
    setFirstName(e.target.value)
  }
  const onSetPost = (e)=>{
    setPost(e.target.value)
  }

  const onSetManifesto = (e)=>{
    setManifesto(e.target.value)
  }

  const onSetPicture = (e)=>{
    setPicture(e.target.files[0])

  }

  const goHome = ()=>{
    navigate('/')
  }

  const goVote = ()=>{
    navigate('/vote')
  }

  const goSetTime = ()=>{
    navigate('/time')
  }

  const handleSubmitVals = async(e)=>{
    const formData = new FormData()
    formData.set('surname',surname)
    formData.set('firstName',firstName)
    formData.set('post',post)
    formData.set('manifesto',manifesto)
    formData.set('picture',picture)

  try {  
      await axios.post('https://votingapp-pmev.onrender.com/election/contestants',formData,{headers:{
      'Content-Type':'multipart/form-data',
      'X-Auth-Token':localStorage.getItem('token')
   }
  })
  setAlert('success','New Contestant Successfully Added!!!',setDisplayAlert)
  }
  catch (err) {
    setAlert('failed',err.error?err.error:'Oops Something Went Wrong!!!',setDisplayAlert)
    
  }
   setSurname('')
   setFirstName('')
   setPost('President')
   setManifesto('')
   setPicture('')
   setResetFile(++resetFile)
  } 

    return(
      <div className="admin">
        {displayAlert.display && <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>}
          <h1>Add A Contestant</h1>
          <div>
            <label htmlFor='surname'>Surname:</label><input type = "text" name = "surname" value = {surname} onChange = {onSetSurname} ></input>
          </div>
          <div>
            <label htmlFor='firstName'>First Name:</label><input type = "text" name = "firstName" value = {firstName} onChange = {onSetFirstName} ></input>
          </div>
          <div>
            <label htmlFor='post'>Post:</label>
            <select name = "post" value ={post} onChange = {onSetPost}>
              <option value = "president" >President</option>
              <option value = "vice president">Vice President</option>
              <option value = "general secretary">General Secretary</option>
              <option value = "assistant general secretary">Assistant General Secretary</option>
              <option value = "treasurer">Treasurer</option>
              <option value = "national financial secretary">National Financial Secretary</option>
              <option value = "welfare secretary">Welfare Secretary</option>
              <option value = "publicity secretary">Publicity Secretary</option>
              <option value = "national legal adviser">National Legal Adviser</option>
              <option value = "national internal auditor">National Internal Auditor</option>
              <option value = "chief whip">Chief Whip</option>
            </select>
          </div>
          <div>
            <label htmlFor='manifesto'>Manifesto:</label><textarea rows = "10" cols = "40" name = "manifesto" value = {manifesto} onChange = {onSetManifesto} style={{resize:'none'}}></textarea>
          </div>
          <div>
            <label htmlFor='picture'>Upload Picture:</label><input type = "file" name = "picture" key = {resetFile}  onChange = {onSetPicture}></input>
          </div>
          <div className = "buttons">
          <div data-tooltip = "Add A New Contestant">
            <button className = "roundButton" id="submit" type="button" disabled = {isDisabled} onClick = {handleSubmitVals}><i className="fas fa-plus"></i></button>
          </div>  
          <div data-tooltip = "Go To The Home Page">
            <button className = "roundButton" id="goHome" type="button" onClick = {goHome}><i className="fas fa-home"></i></button>
          </div>  
          <div data-tooltip = "Go To The Voting Page">
            <button className = "roundButton" id="goVote" type="button" onClick = {goVote}><i className="fas fa-poll"></i></button>
          </div>  
          <div data-tooltip = "Go To The Page Where You Can Set Day And Time Election Will Start And End">
            <button className = "roundButton" id="goSetTime" type="button" onClick = {goSetTime}><i className="fas fa-stopwatch"></i></button>
          </div>  
        </div>
      </div>
  )
    
}

const mapStateToProps = (state)=>({
  adminAuthenticated:state.admin.adminIsAuthenticated,
})

export default connect(mapStateToProps)(Admin)