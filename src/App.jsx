import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route ,useHistory} from 'react-router-dom'
import Home from './Home'
import UserForm from './UserForm'
import GameApp from './GameApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'

export default function App() {
    const [user, loading, error] = useAuthState(auth)
    // const history = useHistory()
    // useEffect(() => {
    //     if(history)
    //     const user1 = localStorage.getItem('userName')
    //     if(!user1){
    //         history.push('/userform')
    //     }
    // }
    // }, [localStorage,history])
    
    if (loading) {
        return 'loading ...'
    }
    if (error) {
        return 'There was an error'
    }
    if (!user) {
        return <UserForm />
    }
// fuck
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home></Home>
                </Route>
                <Route path="/game/:id">
                    <GameApp />
                </Route>
                <Route exact path="/userform">
                    <UserForm />
                </Route>
            </Switch>
        </Router>
    )
}