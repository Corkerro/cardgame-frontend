import React from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
import Player from './Player.jsx';
import Card from './Card.jsx';
import EnemyCard from './EnemyCard.jsx';

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

    const playerCards = [
        {
            name: 'Card Name',
            attac: 10,
            defense: 8,
            price: 10,
            imgUrl: 'cards/card-1.png',
        },
        {
            name: 'Card Name2',
            attac: 2,
            defense: 8,
            price: 4,
            imgUrl: 'cards/card-1.png',
        },
        {
            name: 'Card Name3',
            attac: 2,
            defense: 8,
            price: 4,
            imgUrl: 'cards/card-1.png',
        },
        {
            name: 'Card Name4',
            attac: 2,
            defense: 8,
            price: 4,
            imgUrl: 'cards/card-1.png',
        },
        {
            name: 'Card Name5',
            attac: 2,
            defense: 8,
            price: 4,
            imgUrl: 'cards/card-1.png',
        },
    ];

    const enemyCardCount = 5;

    return (
        <div className="gamepage">
            <aside className="gamepage__aside">
                <Player player={enemy} otherClasses={'reverse'} />
                <img src="logo.png" alt="" className="gamepage__logo" />
                <Player player={player} />
            </aside>
            <div className="gamebox">
                <div className="enemy-hand hand">
                    {Array.from({ length: enemyCardCount }).map((_, index) => (
                        <EnemyCard key={index} />
                    ))}
                </div>

                <div className="player-hand hand">
                    {playerCards.map((card, index) => (
                        <Card key={index} card={card} />
                    ))}
                </div>
            </div>
        </div>
    );
}
