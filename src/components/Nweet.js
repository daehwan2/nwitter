import { authService, dbService,storageService } from 'fbase';
import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {deleteObject, ref} from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';
const Nweet = ({userObj,nweetObj,isOwner})=>{
    const [editing,setEditing]=useState(false);
    const [newNweet,setNewNweet]=useState(nweetObj.text);
    const onDeleteClick = async ()=>{
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok){
            await deleteDoc(doc(dbService, "nweets",nweetObj.id));
            if(nweetObj.attachmentUrl !== "")
                await deleteObject(ref(storageService, nweetObj.attachmentUrl));
        }
    }
    const onSubmit = async(event)=>{
        event.preventDefault();
        await updateDoc(doc(dbService, "nweets",nweetObj.id),{
            text:newNweet
        });
        setEditing(false);
    }
    const onChange = (event)=>{
        const {target:{value}}=event;
        setNewNweet(value);
    }
    const toggleEditing = () =>setEditing((prev)=>!prev);
    return(
        <div>
            {
                editing ? 
                <div className="tweetContainer">
                    <div className="tweetProfile">
                        <div className="bold userName">{nweetObj.creatorName}</div>
                    </div>
                    <form className="editForm" onSubmit={onSubmit}>
                        <input onChange={onChange} type="text" placeholder="Edit your nweet" value={newNweet} required/>
                        <input type="submit" value="Update"/>
                    </form>
                    <FontAwesomeIcon className="editCancel" onClick={toggleEditing} icon={faWindowClose}/> 
                </div> :
                <div className="tweetContainer">
                    <div className="tweetProfile">
                        <div className="bold userName">{nweetObj.creatorName}</div>
                        
                    </div>
                    <div className="nweet">

                        {nweetObj.attachmentUrl && <img className="image" src={nweetObj.attachmentUrl} width="50px" height="50px" />}
                        <h4>{nweetObj.text}</h4>                
                        {isOwner ?
                        <div className="deleteAndEdit">
                            <div className="createdAt">{Date(nweetObj.createdAt)}</div>
                            <button onClick={toggleEditing}><FontAwesomeIcon icon={faEdit}/></button>
                            <button onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashAlt}/></button>
                        </div>:
                        <div className="createdAt">{Date(nweetObj.createdAt)}</div>}
                    </div>
                </div>
            }
            
        </div>
    );
};

export default Nweet;