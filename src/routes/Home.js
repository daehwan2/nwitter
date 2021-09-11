import React, { useEffect, useState } from 'react';
import {dbService} from 'fbase';
import {doc, collection, addDoc,getDocs, onSnapshot} from 'firebase/firestore';
import Nweet from 'components/Nweet';
const Home = ({userObj})=>{
    const [nweet,setNweet]=useState("");
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
    const onSubmit=async (event)=>{
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
              text:nweet,
              createdAt:Date.now(),
              creatorId:userObj.uid,
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setNweet("");
    };
    const onChange=(event)=>{
        const {target:{value}}=event;
        setNweet(value);
    };
    
    console.log(nweets);
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet"/>
            </form>
            <div>
            {nweets.map((nweet)=>(
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
            ))}
            </div>
        </div>
        
    );
}
export default Home;