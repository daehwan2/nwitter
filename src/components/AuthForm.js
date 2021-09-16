import { authService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';

const AuthForm = ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error,setError] = useState("");
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //create account
                data = await createUserWithEmailAndPassword(authService, email, password)
                    
            } else {
                // log in
                data = await signInWithEmailAndPassword(authService, email, password)
                    
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }
    }
    const toggleAccount = ()=>{
        return setNewAccount((prev)=>!prev);
    }
    return(
        <>
        <form onSubmit={onSubmit} className="loginForm">
                <input className="idStyle" name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input className="passStyle" name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input className="buttonStyle" type="submit" value={newAccount ? "Create Acount" : "Log In"} />
        </form>
        {error}
        <span className="smallButton" onClick={toggleAccount}>{newAccount ? "Log In" : "Create Account"}</span>
        </>
    );
}

export default AuthForm;