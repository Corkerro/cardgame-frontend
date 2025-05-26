import React, { useEffect, useState, useRef } from 'react';
import '../assets/styles/findgame.scss';
import UserItem from './components/user/UserItem.jsx';
import { useNavigate } from 'react-router-dom';
import parseJwt from '../components/ParseJwt.js';
import getCookie from '../components/GetCookie.js';
import { useNamespaceSocket } from '../components/MultiSocketContext.jsx';

const possibleNames = [
    'SkullSlasher',
    'CardMaster',
    'AceKing',
    'DarkDealer',
    'QueenCrusher',
    'RedJack',
    'FoldedFate',
    'BluffBot',
    'StackRunner',
    'DealerX',
];

export default function FindGamePage() {
    const [enemyName, setEnemyName] = useState('...');
    const [searching, setSearching] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [finalEnemy, setFinalEnemy] = useState(null);
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const startTimeRef = useRef(null);
    const [enemyAvatarUrl, setEnemyAvatarUrl] = useState(null);
    const socket = useNamespaceSocket('matchmaking');
    const enemyNameRef = useRef(null);

    useEffect(() => {
        if (!searching || !socket || !socket.connected) return;

        startTimeRef.current = Date.now();

        const timer = setInterval(() => {
            const secondsElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setElapsedTime(secondsElapsed);
        }, 1000);

        const nameInterval = setInterval(() => {
            const randomName = possibleNames[Math.floor(Math.random() * possibleNames.length)];
            setEnemyName(randomName);
        }, 100);

        socket.emit('joinQueue');

        const handleMatchFound = (data) => {
            const timeout = data.countdown ? data.countdown * 500 : 1000;

            setTimeout(() => {
                console.log('Match found data from server:', data);
                setFinalEnemy(data.opponentName || 'EnemyPlayer');
                enemyNameRef.current = data.opponentName || 'EnemyPlayer';
                setEnemyName(data.opponentName || 'EnemyPlayer');
                setSearching(false);
                clearInterval(nameInterval);
                clearInterval(timer);
                setEnemyAvatarUrl(`${baseURL}/avatars/${data.opponentName}_ava.jpg`);
            }, timeout);
        };

        const handleGameStart = (data) => {
            console.log('handleGameStart', finalEnemy);
            console.log('Game start data from server:', data);
            navigate('/game', {
                state: {
                    opponentName: enemyNameRef.current || 'EnemyPlayer',
                    gameId: data.gameId,
                    gameSettings: data.gameSettings,
                },
            });
        };

        socket.on('matchFound', handleMatchFound);
        socket.on('gameStart', handleGameStart, (res) => {
            console.log(res)
        });

        return () => {
            socket.off('matchFound', handleMatchFound);
            socket.emit('leaveQueue');
            clearInterval(timer);
            clearInterval(nameInterval);
        };
    }, [searching, socket]);

    const handleFindGame = () => {
        if (searching) {
            if (socket && socket.connected) {
                socket.emit('leaveQueue');
            }
            setSearching(false);
            setElapsedTime(0);
            setFinalEnemy(null);
            setEnemyName('...');
        } else {
            setSearching(true);
            setElapsedTime(0);
            setFinalEnemy(null);
            setEnemyName('...');
        }
    };

    const formatTime = (totalSeconds) => {
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const username = parseJwt(getCookie('jwt')).username;

    return (
        <div className="findgame">
            <div className="findgame__container">
                <img
                    className="findgame__logo"
                    src="logo.png"
                    alt="Acehole"
                    onClick={() => navigate('/')}
                />

                <div className="findgame__search">
                    <UserItem
                        userName={`${username}`}
                        initialAvatarUrl={`${baseURL}/avatars/${username}_ava.jpg`}
                    />
                    <p>VS</p>
                    <UserItem
                        userName={enemyName}
                        otherClasses={'reverse'}
                        initialAvatarUrl={enemyAvatarUrl}
                    />
                </div>

                <p className="findgame__timer">
                    {searching || finalEnemy ? `${formatTime(elapsedTime)}` : '00:00'}
                </p>

                <button
                    type="button"
                    className="button findgame__button"
                    onClick={handleFindGame}
                    disabled={!!finalEnemy}
                >
                    {searching ? 'Cancel' : finalEnemy ? 'Match found' : 'Find Game'}
                </button>
            </div>
        </div>
    );
}
