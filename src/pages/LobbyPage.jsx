import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/lobby.scss';
import UserItem from './components/user/UserItem';

export default function LobbyPage() {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate('/game');
    };

    return (
        <div className="lobby">
            <div className="lobby__container">
                <img src="logo.png" alt="Acehole" />

                <UserItem userName={'User1'} />

                <button type="button" className="button lobby__button" onClick={handlePlayClick}>
                    PLAY
                </button>
            </div>
        </div>
    );
}
