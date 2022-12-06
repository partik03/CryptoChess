import React, { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { useHistory } from 'react-router-dom'
import "./styles/home.css"
import { useAppContext } from './context/appcontext'
export default function Home() {
    const { currentUser } = auth
    const [showModal, setShowModal] = useState(false)
    const history = useHistory()
    const newGameOptions = [
        { label: 'Black pieces', value: 'b' },
        { label: 'White pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]
    const {currentAccount, connected,connectWallet} = useAppContext()
    console.log(currentAccount);
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
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game)
        
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
            <div className={`modal ${showModal ? 'is-active' : ''} is-active`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                Please Select the piece you want to start
                            </div>

                        </div>
                        <footer className="card-footer">
                            {newGameOptions.map(({ label, value }) => (
                                <span className="card-footer-item pointer" key={value}
                                    onClick={() => startOnlineGame(value)}>
                                    {label}
                                </span>
                            ))}
                        </footer>
                    </div>
                </div>
                <button className="modal-close is-large" onClick={() => setShowModal(false)}></button>
            </div>
        </>
    )
}
