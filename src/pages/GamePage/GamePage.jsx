import React from 'react';
import '../../assets/styles/game/gamepage.scss';
import Player from './Player.jsx';

export default function GamePage({ onNavigate }) {
    const enemy = {
        avaUrl: '',
        hp: 20,
        money: 20,
        username: 'Enemy',
    };

    const player = {
        avaUrl: '',
        hp: 20,
        money: 20,
        username: 'Player',
    };

    return (
        <div className="gamepage">
            <aside className="gamepage__aside">
                <Player player={enemy} otherClasses={'reverse'} />
                <img src="logo.png" alt="" className="gamepage__logo" />
                <Player player={player} />
            </aside>
        </div>
    );
}
