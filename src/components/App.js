import React,{useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init,setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj,setUserObj]=useState(null);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(true);
        if(!user.displayName){
          setUserObj({
            displayName:"이름없음",
            uid:user.uid
          });
        }else{
          setUserObj({
            displayName:user.displayName,
            uid:user.uid
          });
        }
      }else{
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    })
  }, []);
  const refreshUser=()=>{
    const user = authService.currentUser;
    if(!user.displayName){
      setUserObj({
        displayName:"이름없음",
        uid:user.uid
      });
    }else{
      setUserObj({
        displayName:user.displayName,
        uid:user.uid
      });
    }
  }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    </>
  );
}

export default App;
