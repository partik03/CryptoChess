import React, { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { useHistory } from 'react-router-dom'
import "./styles/home.css"
import { useAppContext } from './context/appcontext'
export default function Home() {
    const { currentUser } = auth
    const [showModal, setShowModal] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [link, setLink] = useState(null)
    const history = useHistory()
    const newGameOptions = [
        { label: 'Black pieces', value: 'b' },
        { label: 'White pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]
    const {currentAccount, connected,connectWallet} = useAppContext()
    console.log(currentAccount);
    const copyToClipBoard = async() => {
        await navigator.clipboard.writeText(window.location.href +"/game/"+ link)
        alert('Link copied to clipboard')
        
    }
    function handlePlayOnline() {
        setShowModal(true)
    }
    useEffect(() => {
        const user1 = localStorage.getItem('userName')
        if (!user1) {
            history.push('/userform')
        }
    }, [])
    
    
    async function startOnlineGame(startingPiece) {
        console.log('startingPiece', currentUser.uid);

        const member = {
            uid: currentUser.uid,
            piece: startingPiece === 'r' ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('wallet'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game)
        setLink(game.gameId)
        setWaiting(true)
        // history.push(`/game/${game.gameId}`)
    }

    return (
        <>
            <div className='home'>
                <div className='left'>
                    <div className='left_head'>
                        <h1>Crypto-Chess</h1>
                    </div>
                    <div className='game_btns'>
                        <div className='btn'>
                            <button>Local Multiplayer</button>
                        </div>
                        <div className='btn'>
                            <button onClick={handlePlayOnline}>Play Online</button>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='right_nav'>
                        <div className='user_account'>
                            {!connected ?
                            <button onClick={connectWallet}>Connect Wallet</button>
                            :
                            currentAccount}
                        </div>
                    </div>
                    <div className='right_chessbox'>

                    </div>
                </div>
            </div>
            <div className={`modal ${showModal ? 'is-active' : ''}`}>
               { !waiting ?
               <div className='modal_content'>
                    <h1>Choose the color of your pieces</h1>
                    <div className='modal_btns'>
                    {
                        newGameOptions.map((option, index) => {
                            return (
                                <button key={index} onClick={() => startOnlineGame(option.value)}>{option.label}</button>
                            )
                        })
                    }
                    </div>   
                <button className="modal_close" onClick={() => setShowModal(false)}>X</button>
                </div>
                :
                <div className='modal_content1'>
                <input type="text" name="" id="link_input" className="input" readOnly onClick={()=>{history.push("/game/" +link)}} value={window.location + "game/" + link} />
                <div className='modal_btns1'>
                    <button onClick={copyToClipBoard}>Copy</button>
                {/* {
                    newGameOptions.map((option, index) => {
                        return (
                            <button key={index} onClick={() => startOnlineGame(option.value)}>{option.label}</button>
                        )
                    })
                } */}
                </div>   
            <button className="modal_close" onClick={() => {setWaiting(false);setShowModal(false)}}>X</button>
            </div>
                }
            </div>
        </>
    )
}
