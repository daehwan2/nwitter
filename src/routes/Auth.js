import { authService } from 'fbase';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider,signInWithPopup } from 'firebase/auth';
import AuthForm from 'components/AuthForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faDove} from '@fortawesome/free-solid-svg-icons';
import {faGoogle,faGithub} from "@fortawesome/free-brands-svg-icons";
const Auth = () => {
    
    
    const onSocialClick=async (event)=>{
        const {
            target:{name}
        }=event;
        let provider;

        if(name === "google"){
            provider = new GoogleAuthProvider();
        }else if(name ==="github"){
            provider = new GithubAuthProvider();
        }
        await signInWithPopup(authService,provider);
    }
    return (
        <div className="authContainer">
            <FontAwesomeIcon className="faDove" icon={faDove}/>
            <AuthForm/>

            <div>
                <button className="faGoogleBtn" onClick={onSocialClick} name="google">
                    <FontAwesomeIcon className="faGoogle" icon={faGoogle}/>
                </button>
                <button className="faGithubBtn" onClick={onSocialClick} name="github">
                    <FontAwesomeIcon className="faGithub" icon={faGithub}/>
                </button>
            </div>
        </div>
    );
}
export default Auth;