import React,{useState} from 'react';
import {HashRouter as Router,Route,Switch} from 'react-router-dom';
import Profile from 'routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import ProfileNav from './ProfileNav';

 const AppRouter = ({refreshUser, isLoggedIn, userObj})=>{
    return(
    <Router>
        <Switch>
            {isLoggedIn ? 
            <>
            <Route exact path='/'>
                <Navigation userObj={userObj}/>
                <Home userObj = {userObj}/>
            </Route>
            <Route exact path='/profile'>
                <ProfileNav userObj={userObj}/>
                <Profile refreshUser={refreshUser} userObj = {userObj}/>
            </Route>
            </> :
            <Route exact path='/'>
                <Auth/>
            </Route>
            }
        </Switch>
    </Router>
    );
}

export default AppRouter;