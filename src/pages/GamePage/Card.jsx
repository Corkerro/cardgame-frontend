import React from 'react';

export default function Card({ card }) {
    return (
        <div className="card">
            <ul className="card__stats">
                <li className="card__stat">
                    <img src="sword.svg" alt="Attac" />
                    <span>{card.attac}</span>
                </li>
                <li className="card__stat">
                    <img src="shield.svg" alt="Defense" />
                    <span>{card.defense}</span>
                </li>
                <li className="card__stat">
                    <img src="money.svg" alt="Price" />
                    <span>{card.price}</span>
                </li>
            </ul>

            <img src={`${card.imgUrl}`} alt={`${card.name}`} className="card__img" />

            <p className="card__name">{card.name}</p>
        </div>
    );
}
