import React from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
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
            <div className="gamebox">
                <div className="card">
                    <ul className="card__stats">
                        <li className="card__stat">
                            <img src="sword.svg" alt="Attac" />
                            <span>10</span>
                        </li>
                        <li className="card__stat">
                            <img src="shield.svg" alt="Defense" />
                            <span>8</span>
                        </li>
                        <li className="card__stat">
                            <img src="money.svg" alt="Price" />
                            <span>10</span>
                        </li>
                    </ul>

                    <img src="cards/card-1.png" alt="Card Name" className="card__img" />

                    <p className="card__name">Card Name</p>
                </div>
            </div>
        </div>
    );
}
