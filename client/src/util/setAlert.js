const setAlert = (cls,message,setDisplayAlert)=>{
    setDisplayAlert({display:true,cls,message})
    setTimeout(()=>{
      setDisplayAlert({display:false,cls:'',message:''})
    },5000)
  }
  export default setAlert

