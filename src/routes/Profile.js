import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {doc, collection, addDoc,getDocs, query, where, orderBy, updateDoc} from 'firebase/firestore';
import Nweet from 'components/Nweet';
import { updateProfile } from 'firebase/auth';

export default ({userObj,refreshUser,nweetObj}) => {
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
        querySnapshot.forEach(async(doc2)=>{
            await updateDoc(doc(dbService, "nweets",doc2.id),{
                creatorName:newDisplayName
            });
        });
    };
    useEffect(()=>{
        
    },[]);
    
    const onSubmit = async (event)=>{
        event.preventDefault();
        getMyNweets();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser,{
                displayName:newDisplayName                
            });
            refreshUser();
            history.push('/');
        }
    }
    const onChange = (event)=>{
        const {target:{value}}=event;
        setNewDisplayName(value);
    }
    return (
        <div className="editProfileContainer">
            <form className="editNameForm" onSubmit={onSubmit}>
                <input type="text" placeholder="Display Name" onChange={onChange} value={newDisplayName}/>
                <input type="submit" value="Update Profile"/>
            </form>
            <Link className="bold home" to='/'>Home</Link>
            <button onClick={onLogOutClick}>Log Out</button>
        </div>
    );
}