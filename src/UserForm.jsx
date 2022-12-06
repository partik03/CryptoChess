import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAppContext } from './context/appcontext'
import { auth, db } from './firebase'
import "./styles/userform.css"
export default function UserForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {currentAccount,connected,connectWallet,setCurrentAccount} = useAppContext()
    const [mode, setMode] = useState('signup')
    const history = useHistory()
    
    async function handleLoginSubmit(e) {
        e.preventDefault()
        if(!connected){
            alert("Please connect your wallet")
            return;
        }
        try{
            auth.signInWithEmailAndPassword(email,password)
            .then(e=>{
                console.log(e);
                localStorage.setItem('userName',name)
                history.push("/")

            })
            .catch(err=>{
                console.log("error while signing in",err);
            })
        }
        catch(error){
            alert(error)
        }
    }
    async function handleSignupSubmit(e) {
        e.preventDefault()
        if(!connected){
            alert("Please connect your wallet")
            return;
        }
        try {
            auth.createUserWithEmailAndPassword(email,password)
            .then(e=>{
                console.log(e);
                db.collection('users').doc(e.user.uid).set({
                    email:email,
                    password:password,
                    name:name,
                    wallet:currentAccount,
                    uid:e.user.uid
                }).then(e=>{
                    console.log(e);
                    localStorage.setItem('userName',name)
                    history.push("/")
                    
                })
                .catch(er=>{
                    console.log("error while adding to database",er);
                })
            })
            .catch(err=>{
                console.log("error while creating user",err);
            })
        } catch (error) {
            alert(error)
        }
    }
    useEffect(() => {
      const ac = localStorage.getItem('wallet')
      setCurrentAccount(ac)
    }, [])
    
    
    return (
        <section className='userform'>
        <div className='left'>
            <h1>Sign Up With Crypto Chess</h1>
        <form className="user-form">
            {
                mode ==="signup" ?
                <>
                <div className='input'>
                <input type="email" placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div className='input'>
                <input type="text" placeholder='Username' onChange={(e)=>{setName(e.target.value)}} />
            </div>
            <div className='input'>
                <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
                </>
                :
                <>
                 <div className='input'>
                <input type="email" placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}} />
                </div>
                <div className='input'>
                    <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                </>
            }
            
            <div className='btn'>
                <button onClick={connectWallet}>
                    {!connected ? "Connect Wallet" : currentAccount}
                    
                    </button>
            </div>
            <div className='btn'>
                <button onClick={mode === "signup"  ? handleSignupSubmit : handleLoginSubmit}>
                  {
                    mode==="signup" ? "Sign Up" :"Login"
                  } 
                </button>
            </div>
            {
                mode === "signup" ?
                <p style={{color:"white"}}>Already a User?<span style={{cursor:"pointer",color:"blue"}} onClick={(e)=>{setMode("login")}}> Login</span></p>

                :
                <p style={{color:"white"}}>New to Crypto-Chess?<span style={{cursor:"pointer",color:"blue"}} onClick={(e)=>{setMode("signup")}}> Signup</span></p>
            }
            
        </form>
        </div>
        <div className='right'>
            <div className='right_nav'>

            </div>
            <div className='right_chessbox'>

            </div>
        </div>
        
        </section>
    )
}