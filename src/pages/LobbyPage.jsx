import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/lobby.scss';
import { toast } from 'react-toastify';
import UserItem from './components/user/UserItem';
import getCookie from "../components/GetCookie.js";
import parseJwt from "../components/ParseJwt.js";

export default function LobbyPage() {
    const navigate = useNavigate();
    const username = parseJwt(getCookie('jwt')).username;

    const handlePlayClick = () => {
        navigate('/find-game');
    };

    const handleLogoutClick = () => {
        toast.success('Successfully logout!');
        navigate('/auth');
    };

    return (
        <div className="lobby">
            <div className="lobby__container">
                <img src="logo.png" alt="Acehole" />

                <UserItem userName={`${username}`} editable={true} otherClasses={'center'} />

                <button type="button" className="button lobby__button" onClick={handlePlayClick}>
                    PLAY
                </button>

                <button
                    type="button"
                    className="button lobby__button danger"
                    onClick={handleLogoutClick}
                >
                    LOGOUT
                </button>
            </div>
        </div>
    );
}
