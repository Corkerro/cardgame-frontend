import React, { useState, useEffect } from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
import Player from './Player.jsx';
import Card from './Card.jsx';
import EnemyCard from './EnemyCard.jsx';

const initialHP = 20;
const maxHandSize = 5;
const maxBoardSize = 5;
const turnTime = 30;

const allCards = [
    { name: 'Iron Man', attac: 10, defense: 6, price: 8, imgUrl: 'cards/card-1.png' },
    { name: 'Thanos', attac: 12, defense: 8, price: 10, imgUrl: 'cards/card-1.png' },
    { name: 'Hulk', attac: 8, defense: 5, price: 7, imgUrl: 'cards/card-1.png' },
    { name: 'Spider-Man', attac: 6, defense: 4, price: 6, imgUrl: 'cards/card-1.png' },
    { name: 'Captain Marvel', attac: 9, defense: 6, price: 9, imgUrl: 'cards/card-1.png' },
];

function getRandomCard() {
    return allCards[Math.floor(Math.random() * allCards.length)];
}

export default function GamePage({ onNavigate }) {
    const [playerHP, setPlayerHP] = useState(initialHP);
    const [enemyHP, setEnemyHP] = useState(initialHP);
    const [playerHand, setPlayerHand] = useState([]);
    const [enemyHand, setEnemyHand] = useState([]);
    const [currentTurn, setCurrentTurn] = useState('');
    const [timer, setTimer] = useState(turnTime);
    const [gameOver, setGameOver] = useState(false);
    const [playerBoard, setPlayerBoard] = useState([]);
    const [enemyBoard, setEnemyBoard] = useState([]);
    const [playerMoney, setPlayerMoney] = useState(20);
    const [enemyMoney, setEnemyMoney] = useState(20);

    useEffect(() => {
        setPlayerHand(Array.from({ length: maxHandSize }, getRandomCard));
        setEnemyHand(Array.from({ length: maxHandSize }, getRandomCard));
        setCurrentTurn(Math.random() < 0.5 ? 'player' : 'enemy');
    }, []);

    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    handlePassTurn();
                    return turnTime;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [currentTurn, gameOver]);

    useEffect(() => {
        if (gameOver) {
            setTimeout(() => {
                alert(playerHP <= 0 ? 'You Lose!' : 'You Win!');
            }, 100);
        }
    }, [gameOver]);

    useEffect(() => {
        if (currentTurn === 'enemy' && !gameOver) {
            setTimeout(() => {
                enemyMove();
                setCurrentTurn('player');
                setTimer(turnTime);
            }, 500);
        }
    }, [currentTurn, gameOver]);

    function playCard(index) {
        if (gameOver || currentTurn !== 'player') return;

        if (playerBoard.length >= maxBoardSize) {
            alert("No more space on the board!");
            return;
        }

        const card = playerHand[index];

        if (playerMoney < card.price) {
            alert("Not enough money to play this card!");
            return;
        }

        const damage = Math.max(0, card.attac - 3);

        setEnemyHP(hp => {
            const newHP = Math.max(0, hp - damage);
            if (newHP === 0) setGameOver(true);
            return newHP;
        });

        setPlayerMoney(m => m - card.price);
        setPlayerBoard(board => [...board, card]);

        const newHand = [...playerHand];
        newHand.splice(index, 1);
        setPlayerHand([...newHand, getRandomCard()].slice(0, maxHandSize));
    }

    function handlePassTurn() {
        if (gameOver) return;

        if (currentTurn === 'player') {
            setPlayerMoney(m => Math.min(20, m + 2));
            setCurrentTurn('enemy');
        }
        setTimer(turnTime);
    }

    function enemyMove() {
    let money = enemyMoney;
    let board = [...enemyBoard];
    let hand = [...enemyHand];
    let playerHPTemp = playerHP;
    let gameOverFlag = false;

    const spaceLeft = maxBoardSize - board.length;

        for (let i = 0; i < spaceLeft; i++) {
            const affordableCards = hand.filter(card => money >= card.price);
            if (affordableCards.length === 0) break;

            const card = affordableCards[Math.floor(Math.random() * affordableCards.length)];
            const index = hand.findIndex(c => c === card);

            const damage = Math.max(0, card.attac - 2);
            playerHPTemp = Math.max(0, playerHPTemp - damage);
            if (playerHPTemp === 0) {
                gameOverFlag = true;
            }

            money -= card.price;
            board.push(card);

            hand.splice(index, 1);
            hand.push(getRandomCard());
            hand = hand.slice(0, maxHandSize);
        }

        setEnemyMoney(Math.min(20, money + 2)); // бонус
        setEnemyBoard(board);
        setEnemyHand(hand);
        setPlayerHP(playerHPTemp);
        if (gameOverFlag) setGameOver(true);
    }


    const player = {
        avaUrl: '',
        hp: playerHP,
        money: playerMoney,
        username: 'Player',
    };

    const enemy = {
        avaUrl: '',
        hp: enemyHP,
        money: enemyMoney,
        username: 'Enemy',
    };

    return (
        <div className="gamepage">
            <aside className="gamepage__aside">
                <Player player={enemy} otherClasses={'reverse'} />
                <img src="logo.png" alt="" className="gamepage__logo" />
                <Player player={player} />
            </aside>

            <div className="gamebox">
                <div className="enemy-hand hand">
                    {enemyHand.map((_, index) => (
                        <EnemyCard key={index} />
                    ))}
                </div>

                <div className="game-deck">
                    <div className="enemy-deck game-deck__cards">
                        {enemyBoard.map((card, index) => (
                            <Card key={index} card={card} />
                        ))}
                    </div>

                    <div className="player-deck game-deck__cards">
                        {playerBoard.map((card, index) => (
                            <Card key={index} card={card} />
                        ))}
                    </div>
                </div>

                <div className="player-hand hand">
                    {playerHand.map((card, index) => (
                        <div key={index} onClick={() => playCard(index)}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>

                <button className="game-button" onClick={handlePassTurn}>
                    {currentTurn === 'player' ? 'PASS' : `Enemy's turn... (${timer})`}
                </button>
            </div>
        </div>
    );
}
