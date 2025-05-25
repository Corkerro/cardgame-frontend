import React, { useState, useEffect } from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
import Player from './Player.jsx';
import Card from './Card.jsx';
import EnemyCard from './EnemyCard.jsx';

const initialHP = 20;
const maxHandSize = 5;
const maxBoardSize = 5;
const turnTime = 20;

const allCards = [
  { name: 'Ant-Man', attac: 5, defense: 3, price: 4, imgUrl: 'cards/Ant-Man.png' },
  { name: 'Black Panther', attac: 7, defense: 6, price: 6, imgUrl: 'cards/Black Panther.png' },
  { name: 'Black Widow', attac: 6, defense: 4, price: 5, imgUrl: 'cards/Black Widow.png' },
  { name: 'Captain America', attac: 8, defense: 8, price: 8, imgUrl: 'cards/Captain America.png' },
  { name: 'Captain Marvel', attac: 9, defense: 7, price: 8, imgUrl: 'cards/Captain Marvel.png' },
  { name: 'Deadpool', attac: 7, defense: 5, price: 6, imgUrl: 'cards/Deadpool.png' },
  { name: 'Doctor Strange', attac: 8, defense: 5, price: 8, imgUrl: 'cards/Doctor Strange.png' },
  { name: 'Falcon', attac: 5, defense: 4, price: 4, imgUrl: 'cards/Falcon.png' },
  { name: 'Groot', attac: 4, defense: 9, price: 6, imgUrl: 'cards/Groot.png' },
  { name: 'Hulk', attac: 10, defense: 6, price: 9, imgUrl: 'cards/Hulk.png' },
  { name: 'Iron Man', attac: 8, defense: 7, price: 8, imgUrl: 'cards/Iron Man.png' },
  { name: 'Ironheart', attac: 7, defense: 6, price: 7, imgUrl: 'cards/Ironheart.png' },
  { name: 'Loki', attac: 6, defense: 5, price: 7, imgUrl: 'cards/Loki.png' },
  { name: 'Rocket Raccoon', attac: 6, defense: 4, price: 5, imgUrl: 'cards/Rocket Raccoon.png' },
  { name: 'Scarlet Witch', attac: 9, defense: 6, price: 9, imgUrl: 'cards/Scarlet Witch.png' },
  { name: 'Shang-Chi', attac: 8, defense: 5, price: 7, imgUrl: 'cards/Shang-Chi.png' },
  { name: 'Spider-Man', attac: 7, defense: 5, price: 6, imgUrl: 'cards/Spider Man.png' },
  { name: 'Star-Lord', attac: 6, defense: 4, price: 5, imgUrl: 'cards/Star-Lord.png' },
  { name: 'Thor', attac: 10, defense: 6, price: 9, imgUrl: 'cards/Thor.png' },
  { name: 'Vision', attac: 8, defense: 7, price: 8, imgUrl: 'cards/Vision.png' }
];

function getRandomCard() {
    return allCards[Math.floor(Math.random() * allCards.length)];
}

export default function GamePage({ onNavigate }) {
    const [playerHP, setPlayerHP] = useState(initialHP);
    const [enemyHP, setEnemyHP] = useState(initialHP);

    // Колоды — по 15 карт
    const [playerDeck, setPlayerDeck] = useState([]);
    const [enemyDeck, setEnemyDeck] = useState([]);

    const [playerHand, setPlayerHand] = useState([]);
    const [enemyHand, setEnemyHand] = useState([]);

    const [playerBoard, setPlayerBoard] = useState([]);
    const [enemyBoard, setEnemyBoard] = useState([]);

    const [playerMoney, setPlayerMoney] = useState(20);
    const [enemyMoney, setEnemyMoney] = useState(20);

    const [currentTurn, setCurrentTurn] = useState('');
    const [timer, setTimer] = useState(turnTime);
    const [gameOver, setGameOver] = useState(false);

    // Инициализация колод и начальных рук
    useEffect(() => {
        // Создаём колоды по 15 случайных карт
        const initialPlayerDeck = Array.from({ length: 15 }, getRandomCard);
        const initialEnemyDeck = Array.from({ length: 15 }, getRandomCard);

        // Извлекаем первые 5 карт в руку, оставшиеся в колоду
        setPlayerHand(initialPlayerDeck.slice(0, maxHandSize));
        setPlayerDeck(initialPlayerDeck.slice(maxHandSize));

        setEnemyHand(initialEnemyDeck.slice(0, maxHandSize));
        setEnemyDeck(initialEnemyDeck.slice(maxHandSize));

        setCurrentTurn(Math.random() < 0.5 ? 'player' : 'enemy');
    }, []);

    // Таймер хода
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

    // Окончание игры
    useEffect(() => {
        if (gameOver) {
            setTimeout(() => {
                alert(playerHP <= 0 ? 'You Lose!' : 'You Win!');
            }, 100);
        }
    }, [gameOver]);

    // Ход врага
    useEffect(() => {
    if (currentTurn === 'enemy' && !gameOver) {
        setEnemyMoney(m => {
            const newMoney = Math.min(20, m + 2);

            setTimeout(() => {
                enemyMove(newMoney);
                setCurrentTurn('player');
                setTimer(turnTime);
            }, 500);

            return newMoney;
        });
    }
}, [currentTurn, gameOver]);


    function resolveBattle() {
        // Суммарные атаки и защиты
        const playerAttackSum = playerBoard.reduce((sum, card) => sum + card.attac, 0);
        const playerDefenseSum = playerBoard.reduce((sum, card) => sum + card.defense, 0);

        const enemyAttackSum = enemyBoard.reduce((sum, card) => sum + card.attac, 0);
        const enemyDefenseSum = enemyBoard.reduce((sum, card) => sum + card.defense, 0);

        // Расчёт урона
        const damageToPlayer = Math.max(0, enemyAttackSum - playerDefenseSum);
        const damageToEnemy = Math.max(0, playerAttackSum - enemyDefenseSum);

        setPlayerHP(hp => {
            const newHP = Math.max(0, hp - damageToPlayer);
            if (newHP === 0) setGameOver(true);
            return newHP;
        });

        setEnemyHP(hp => {
            const newHP = Math.max(0, hp - damageToEnemy);
            if (newHP === 0) setGameOver(true);
            return newHP;
        });

        // Очистка досок после боя
        setPlayerBoard([]);
        setEnemyBoard([]);
    }

    function drawCards(playerType) {
    if (playerType === 'player') {
        setPlayerHand(prevHand => {
            const cardsNeeded = Math.max(0, maxHandSize - prevHand.length);
            const cardsToDraw = playerDeck.slice(0, cardsNeeded);
            setPlayerDeck(prevDeck => prevDeck.slice(cardsNeeded));
            return [...prevHand, ...cardsToDraw];
        });
    } else {
        setEnemyHand(prevHand => {
            const cardsNeeded = Math.max(0, maxHandSize - prevHand.length);
            const cardsToDraw = enemyDeck.slice(0, cardsNeeded);
            setEnemyDeck(prevDeck => prevDeck.slice(cardsNeeded));
            return [...prevHand, ...cardsToDraw];
        });
    }
}




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

        setPlayerMoney(m => m - card.price);
        setPlayerBoard(board => [...board, card]);

        setPlayerHand(hand => {
            const newHand = [...hand];
            newHand.splice(index, 1);
            return newHand;
        });
    }

    function handlePassTurn() {
    if (gameOver) return;

    if (currentTurn === 'player') {
        setPlayerMoney(m => m + 2);
        resolveBattle();
        drawCards('player');
        drawCards('enemy');
        setCurrentTurn('enemy');
    } else {
        setEnemyMoney(m => m + 2);
        resolveBattle();
        drawCards('player');
        drawCards('enemy');
        setCurrentTurn('player');
    }

    setTimer(turnTime);
    }

    function enemyMove(money) {
    let board = [...enemyBoard];
    let hand = [...enemyHand];

    const spaceLeft = maxBoardSize - board.length;

    for (let i = 0; i < spaceLeft; i++) {
        const affordableCards = hand.filter(card => money >= card.price);
        if (affordableCards.length === 0) break;

        const card = affordableCards[Math.floor(Math.random() * affordableCards.length)];
        const index = hand.findIndex(c => c === card);

        money -= card.price;
        board.push(card);
        hand.splice(index, 1);
    }

    setEnemyMoney(money);
    setEnemyBoard(board);
    setEnemyHand(hand);
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
                <div className="enemy-hand-container">
                    <div className="enemy-deck-visual">
                        <EnemyCard />
                        <div className="enemy-deck-count">{enemyDeck.length}</div>
                    </div>

                    <div className="enemy-hand hand">
                        {enemyHand.map((_, index) => (
                            <EnemyCard key={index} />
                        ))}
                    </div>
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

                <button className="game-button" onClick={handlePassTurn} disabled={gameOver}>
                    {gameOver ? 'Game Over' : currentTurn === 'player' ? 'Pass Turn' : 'Enemy Turn...'}
                </button>

                <div className={`timer ${timer <= 10 ? 'low' : ''}`}>
                ⏳ {timer}s
                </div>
            </div>
        </div>
    );
}
