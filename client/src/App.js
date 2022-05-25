import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './Home'
import RegisterOrLogin from './RegisterOrLogin'
import VoteNominees from './VoteNominees'
import ElectionTimeSetter from './ElectionTimeSetter'
import Admin from './Admin'
import AdminSignIn from './AdminSignIn'
import Help from './Help'
import HelpDesk  from './HelpDesk'
import NotFound from './NotFound'
import './App.css'

function App(){
return(
    <div className = "app">
        <BrowserRouter>
            <Routes>
                <Route exact path = '/' element = {<RegisterOrLogin />}/>
                <Route exact path = '/home' element = {<Home toVote = {true}/>}/>
                <Route exact path = '/info' element = {<Home toVote = {false}/>}/>
                <Route exact path = '/admin' element = {<Admin/>} />
                <Route exact path = '/vote' element = {<VoteNominees/>}/>
                <Route exact path = '/time' element = {<ElectionTimeSetter/>}/>
                <Route exact path = '/admin-signin' element = {<AdminSignIn/>}/>
                <Route exact path = '/help' element = {<Help/>}/>
                <Route exact path = '/helpdesk' element = {<HelpDesk/>}/>
                <Route element = {<NotFound/>} />
            </Routes> 
        </BrowserRouter>
    </div>
)  
}
export default App