import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({children})=>{
    const [currentAccount, setCurrentAccount] = useState(null)
    const [connected, setConnected] = useState(null)
    console.log(currentAccount);
    const ac = localStorage.getItem('wallet')
    // setCurrentAccount(ac)
    const connectWallet = async(e)=>{
        e.preventDefault()
        try {
          const {ethereum} = window;
          if(!ethereum){
            alert("Get metamask")
            return;
          }
          const accounts = await ethereum.request({
            method: "eth_requestAccounts"
          })
          console.log("Connected", accounts);
          setCurrentAccount(accounts[0])
          localStorage.setItem('wallet',accounts[0])
          console.log(currentAccount);
          setConnected(true)
        } catch (error) {
          console.log(error);
        }
      }
    return(
        <AppContext.Provider 
        value=
        {{
            currentAccount,
            setCurrentAccount,
            connected,
            setConnected,
            connectWallet
        }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)

