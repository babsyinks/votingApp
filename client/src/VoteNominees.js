import React,{useEffect, useState} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
/* import Particles from 'react-particles-js' */
import {adminLogin} from './actions/adminActions'
import {loading,notLoading} from './actions/loadingActions'
/* import DisplayErrorMessage from './DisplayErrorMessage' */
import ElectivePosition from './ElectivePosition'
import LiveTimer  from './LiveTimer'
import Result from './Result'
import './VoteNominees.css'

/* const params = {"particles":
{"number":{"value":150,"density":{"enable":true,"value_area":800}},      
   "shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},
       "polygon":{"nb_sides":5},
           },
             "opacity":{"value":0.5211089197812949,"random":false,
               "anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},
                 "size":{"value":1,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},
                   "line_linked":{"enable":true,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},
                     "move":{"enable":true,"speed":1,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,
                       "attract":{"enable":false,"rotateX":600,"rotateY":1200}}},
                          "interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},
                             "onclick":{"enable":true,"mode":"push"},"resize":true},
                               "modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},
                                 "bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},
                                   "repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},
                                      "remove":{"particles_nb":2}}},"retina_detect":true}
 */

const VoteNominees = ({login,userAuthenticated,userInfo:{username},load,stopLoading,isLoading,timer})=>{
    //const[displayAlert,setDisplayAlert] = useState({display:false,cls:'',message:''})
    const[arrOfContestants,setArrOfContestants] = useState([])
    const[id,setId] = useState('')
    const[failedFetch,setFailedFetch] = useState(false)
    const navigate = useNavigate()
    
    useEffect(()=>{
      let unmounted = false;
      let source = axios.CancelToken.source()
      const fetch = async()=>{
        if(!unmounted){
           try {
            load()
            //{data:{eleObj:electionArr}}
            const {data:{electObj:electionArr,myId}} = await axios.get('/election/details',{headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
              'X-Auth-Token':localStorage.getItem('token')
            },cancelToken: source.token})
            setId(myId)
            setArrOfContestants(electionArr)
            } catch (error) {
              setFailedFetch(true)  
      
            if (axios.isCancel(error)) {
                console.log(`request cancelled:${error.message}`);
            } 
            }
            stopLoading()
          }
        
      }
     if(userAuthenticated){
          fetch()
     } 
     else{
       navigate('/')
     }
      return function cleanUp(){
        unmounted = true
        source.cancel("Cancelling in cleanup");
      }
      //eslint-disable-next-line
    },[userAuthenticated])

/*       const setAlert = (cls,message)=>{
        setDisplayAlert({display:true,cls,message})
        setTimeout(()=>{
          setDisplayAlert({display:false,cls:'',message:''})
        },5000)
      } */

    const handleLogin = async()=>{
        try {
            const data = await login()
            
            if(data === 'success'){

                navigate('/admin') 
            }
            else{
                navigate('/admin-signin')
            }
        } catch (error) {
                navigate('/admin-signin')
        }
    }

    const goHome = ()=>{
        navigate('/')
    }

    const logOut = ()=>{
      localStorage.removeItem('token')
      navigate('/')
    }
        if(userAuthenticated){ 
          if(!timer.electionStartSet && !timer.electionEndSet && timer.startDate === null && timer.endDate === null){
            return <Result />
          }
          else{
            if(!failedFetch){
              return(
             <div className = "voteNomineesWrapper">
                {/* <Particles params = {params} className = 'particles' /> */}
                 {/* {displayAlert.display && <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>} */}
                   <div className = "headerTab">
                         <i className="fas fa-home" onClick = {goHome}></i>
                         <div>Welcome <span style = {{textTransform:'capitalize'}}>{username.toLowerCase()}.</span> Please Proceed To Vote.</div>
                         {(username === 'admin'||username === 'babsyinks')?<button onClick = {handleLogin} className = {isLoading?'sp':''}>{isLoading?<i className="fas fa-circle-notch fa-spin fa-xs"></i>:'Access Admin'}</button>:<button onClick = {logOut}>Log Out</button>}   
                   </div> 
                   {timer.electionEndSet && <div className = 'voteTm'><LiveTimer electionEndTime = {timer.endDate} /></div>}
                   {arrOfContestants.map(({allVotes,contestants,position},i)=>{ 
                     return <ElectivePosition userId = {id} username = {username} categoryArr = {allVotes}  totalVotes = {allVotes.length}
                                              contestants = {contestants} position = {position} key = {i} 
                                              /> 
                   })} 
             </div>              
           )
           }
           else{
             return (
               <div className = "voteNomineesWrapper"> 
                 {/* {displayAlert.display && <DisplayErrorMessage status = {displayAlert.cls}>{displayAlert.message}</DisplayErrorMessage>} */}
                 <div>
                   <button style = {{padding:'10px',fontWeight:'bold', marginLeft:'10px'}} onClick = {handleLogin}>Add Contestants</button> 
                   <h2 style = {{textAlign:'center',height:'100vh',color:'white'}}>There Is Currently No Election Or Election Data Could Not Be Fetched</h2>
                 </div>
                 
               </div>
             )
           }
          }

        }
        else{ 
            navigate('/')
            return null  
        } 
}

const mapStateToProps = (state)=>({
    userAuthenticated:state.user.userIsAuthenticated,
    adminAuthenticated:state.admin.adminIsAuthenticated,
    userInfo:state.userInfo,
    timer:state.timer,
    isLoading:state.isLoading
})

export default connect(mapStateToProps,{login:adminLogin,load:loading,stopLoading:notLoading})(VoteNominees)