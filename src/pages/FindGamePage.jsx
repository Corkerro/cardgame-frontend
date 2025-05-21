import React, { useEffect, useState } from 'react';
import '../assets/styles/findgame.scss';
import UserItem from './components/user/UserItem.jsx';
import axios from 'axios';
import {toast} from "react-toastify";

const possibleNames = [
    'SkullSlasher', 'CardMaster', 'AceKing', 'DarkDealer', 'QueenCrusher',
    'RedJack', 'FoldedFate', 'BluffBot', 'StackRunner', 'DealerX'
];

export default function FindGamePage() {
    const [enemyName, setEnemyName] = useState('...');
    const [searching, setSearching] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // seconds
    const [finalEnemy, setFinalEnemy] = useState(null);

    useEffect(() => {
        if (!searching) return;

        const startTime = Date.now();

        const timer = setInterval(() => {
            const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
            setElapsedTime(secondsElapsed);
        }, 1000);

        const nameInterval = setInterval(() => {
            const randomName = possibleNames[Math.floor(Math.random() * possibleNames.length)];
            setEnemyName(randomName);
        }, 100);

        const findGame = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL;
                const token = localStorage.getItem('jwt');
                const response = await axios.get(`${baseURL}/game/find`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Enemy find
                setFinalEnemy(response.data.enemyName || 'EnemyPlayer');
                setSearching(false);
                clearInterval(nameInterval);
                clearInterval(timer);
                setEnemyName(response.data.enemyName || 'EnemyPlayer');

            } catch (error) {
                clearInterval(nameInterval);
                clearInterval(timer);
                setSearching(false);
                setEnemyName('Error');
                toast.error(
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Game search failed!</div>
                        <div style={{ fontSize: '0.9rem' }}>
                            {typeof error.response?.data === 'string'
                                ? error.response.data.replace(/^"|"$/g, '')
                                : error.response?.data?.message || error.message}
                        </div>
                    </div>,
                );
                console.error('Game search failed:', error);
            }
        };

        findGame();

        return () => {
            clearInterval(timer);
            clearInterval(nameInterval);
        };
    }, [searching]);

    const handleFindGame = () => {
        setSearching(true);
        setElapsedTime(0);
        setFinalEnemy(null);
        setEnemyName('...');
    };

    const formatTime = (totalSeconds) => {
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="findgame">
            <div className="findgame__container">
                <img src="logo.png" alt="Acehole" />

                <div className="findgame__search">
                    <UserItem userName={'UserName'} />
                    <p>VS</p>
                    <UserItem userName={enemyName} otherClasses={'reverse'} />
                </div>

                <p className="findgame__timer">
                    {searching || finalEnemy ? `${formatTime(elapsedTime)}` : '00:00'}
                </p>

                <button
                    type="button"
                    className="button findgame__button"
                    onClick={handleFindGame}
                    disabled={searching}
                >
                    {searching ? 'Searching...' : 'Find Game'}
                </button>
            </div>
        </div>
    );
}
