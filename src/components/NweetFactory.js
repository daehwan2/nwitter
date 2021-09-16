import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbService, storageService } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState } from 'react';
import {v4 as uuidv4} from "uuid";

const NweetFactory = ({userObj}) =>{
    const [nweet,setNweet]=useState("");
    const [attachment,setAttachment]=useState();
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
                creatorName:userObj.displayName,
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
    const onClearAttachment = ()=>{
        return setAttachment(null);
    }
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
    return (
        <form className="nweetForm" onSubmit={onSubmit}>
            <div className="textAndSubmit">
                <input className="nweetInput" value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <div class="filebox">
                    <label for="ex_file"><FontAwesomeIcon icon={faFileImage}/></label>
                    <input type="file" id="ex_file" accept="image/*" onChange={onFileChange}/>
                </div>
                <input className="nweetSubmit" type="submit" value="NWEET"/>
            </div>
                {/* <input type="file" accept="image/*" /> */}
                

                {attachment && 
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                }
        </form>
    );
}
export default NweetFactory;
