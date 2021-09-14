import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {doc, collection, addDoc,getDocs, query, where, orderBy} from 'firebase/firestore';
import Nweet from 'components/Nweet';
import { updateProfile } from 'firebase/auth';

export default ({userObj,refreshUser}) => {
    const [nweets,setNweets]=useState([]);
    const [newDisplayName, setNewDisplayName]=useState(userObj.displayName);
    const history = useHistory();
    const onLogOutClick = ()=>{
        authService.signOut();
        history.push('/');
    }
    const getMyNweets = async()=>{
        const q = query(
            collection(dbService,"nweets"),
            where("creatorId","==",userObj.uid),
            orderBy("createdAt","desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>console.log(doc.id,"=>",doc.data()));
    };
    useEffect(()=>{
        getMyNweets();
    },[]);
    const onSubmit = async (event)=>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser,{
                displayName:newDisplayName                
            });
            refreshUser();
        }
    }
    const onChange = (event)=>{
        const {target:{value}}=event;
        setNewDisplayName(value);
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName}/>
            <input type="submit" value="Update Profile"/>
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}