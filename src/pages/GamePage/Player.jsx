import React from 'react';
import '../../assets/styles/game/player.scss';

export default function Player({ player, otherClasses }) {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    return (
        <div className={`player ${otherClasses}`}>
            <p className="player__name">{player.username}</p>
            <div className="player__block">
                <div className="player__ava">
                    <img src={`${baseURL}/avatars/${player.username}_ava.jpg`} alt="Avatar" />
                </div>
                <div className="player__stat hp">
                    <img src="hp.svg" alt="hp" />
                    <span>{player.hp}</span>
                </div>
                <div className="player__stat money">
                    <img src="money.svg" alt="hp" />
                    <span>{player.money}</span>
                </div>
            </div>
        </div>
    );
}
