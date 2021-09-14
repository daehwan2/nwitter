import React, { useEffect, useState } from 'react';
import {dbService, storageService} from 'fbase';
import { ref, uploadString,getDownloadURL, getStorage } from "@firebase/storage";
import {doc, collection, addDoc,getDocs, onSnapshot} from 'firebase/firestore';
import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';
const Home = ({userObj})=>{
    
    const [nweets,setNweets]=useState([]);
    const getNweets = async()=>{
        const dbnweets = await getDocs(collection(dbService, "nweets"));
        dbnweets.forEach((doc) => {
            const nweetObject={
                ...doc.data(),
                id:doc.id,
            };
            setNweets((prev)=>[nweetObject,...prev]);
        });
          
    }
    useEffect(()=>{
        getNweets();
        const unsub = onSnapshot(collection(dbService, "nweets"), (snapshot) => {
            const nweetArray = snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
            setNweets(nweetArray);
        });
    },[])
    
    
    
    return(
        <div>
            <NweetFactory userObj={userObj}/>
            <div>
            {nweets.map((nweet)=>(
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
            ))}
            </div>
        </div>
        
    );
}
export default Home;