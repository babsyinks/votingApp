
const setUserInfoTest = (num,name)=>({
    type:'USER_INFO',
    payload:{num,name} 
  })
  
  describe('actions of userInfo',()=>{
    it('checks userinfo for correct values',()=>{
      expect(setUserInfoTest(333,"Andrei")).toEqual({
        type:'USER_INFO',
        payload:{num:333,name:"Andrei"}
      })
    })
  })