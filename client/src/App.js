import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import RegisterOrLogin from './RegisterOrLogin'
import VoteNominees from './VoteNominees'
import ElectionTimeSetter from './ElectionTimeSetter'
import Admin from './Admin'
import AdminSignIn from './AdminSignIn'
import Help from './Help'
import NotFound from './NotFound'
import './App.css'

function App(){
return(
    <div className = "app">
        <BrowserRouter>
            <Routes>
                <Route exact path = '/' element = {<RegisterOrLogin />}/>
                <Route exact path = '/admin' element = {<Admin/>} />
                <Route exact path = '/vote' element = {<VoteNominees/>}/>
                <Route exact path = '/time' element = {<ElectionTimeSetter/>}/>
                <Route exact path = '/admin-signin' element = {<AdminSignIn/>}/>
                <Route exact path = '/help' element = {<Help/>}/>
                <Route exact path = '/reset-election' element = {<AdminSignIn resetElection={true} />}/>
                <Route element = {<NotFound/>} />
            </Routes> 
        </BrowserRouter>
    </div>
)  
}
export default App