import React from 'react';
import '../assets/styles/lobby.scss';
import UserItem from './components/user/UserItem';

export default function LobbyPage() {
    return (
        <div className="lobby">
            <div className="lobby__container">
                <img src="logo.png" alt="Acehole" />

                <UserItem userName={'User1'} />

                <button type="button" class="button lobby__button">
                    PLAY
                </button>
            </div>
        </div>
    );
}
