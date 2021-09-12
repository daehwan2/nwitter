import React, { useEffect, useState } from 'react';
import {v4 as uuidv4} from "uuid";
import {dbService, storageService} from 'fbase';
import { ref, uploadString,getDownloadURL, getStorage } from "@firebase/storage";
import {doc, collection, addDoc,getDocs, onSnapshot} from 'firebase/firestore';
import Nweet from 'components/Nweet';
const Home = ({userObj})=>{
    const [nweet,setNweet]=useState("");
    const [nweets,setNweets]=useState([]);
    const [attachment,setAttachment]=useState();
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
            let attachmentUrl="";
            if(attachment){
                const attachmentRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
                const response = await uploadString(attachmentRef,attachment,"data_url");
                attachmentUrl = await getDownloadURL(response.ref);
            }
            const nweetObj = {
                text:nweet,
                createdAt:Date.now(),
                creatorId:userObj.uid,
                attachmentUrl
            }
            const docRef = await addDoc(collection(dbService, "nweets"),nweetObj);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setNweet("");
        setAttachment("");
    };
    const onChange=(event)=>{
        const {target:{value}}=event;
        setNweet(value);
    };
    const onFileChange = (event)=>{
        const {target:{files}}=event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvnet)=>{
            const  {currentTarget:{result}}=finishedEvnet;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = ()=>{
        return setAttachment(null);
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet"/>
                {attachment && 
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                }
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