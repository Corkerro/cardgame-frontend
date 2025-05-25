import React, { useState, useEffect } from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
import Player from './Player.jsx';
import Card from './Card.jsx';
import EnemyCard from './EnemyCard.jsx';
import parseJwt from '../../components/ParseJwt.js';
import getCookie from '../../components/GetCookie.js';
import {useLocation, useNavigate} from 'react-router-dom';

const initialHP = 20;
const maxHandSize = 5;
const maxBoardSize = 5;
const turnTime = 20;

const allCards = [
    { name: 'Ant-Man', attac: 5, defense: 3, price: 4, imgUrl: 'cards/Ant-Man.png' },
    { name: 'Black Panther', attac: 7, defense: 6, price: 6, imgUrl: 'cards/Black Panther.png' },
    { name: 'Black Widow', attac: 6, defense: 4, price: 5, imgUrl: 'cards/Black Widow.png' },
    {
        name: 'Captain America',
        attac: 8,
        defense: 8,
        price: 8,
        imgUrl: 'cards/Captain America.png',
    },
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
    { name: 'Vision', attac: 8, defense: 7, price: 8, imgUrl: 'cards/Vision.png' },
];

function getRandomCard() {
    return allCards[Math.floor(Math.random() * allCards.length)];
}

export default function GamePage({ onNavigate }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [playerHP, setPlayerHP] = useState(initialHP);
    const [enemyHP, setEnemyHP] = useState(initialHP);
    const [mainDeck, setMainDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [enemyHand, setEnemyHand] = useState([]);
    const [playerBoard, setPlayerBoard] = useState([]);
    const [enemyBoard, setEnemyBoard] = useState([]);
    const [playerMoney, setPlayerMoney] = useState(20);
    const [enemyMoney, setEnemyMoney] = useState(20);
    const [currentTurn, setCurrentTurn] = useState('');
    const [roundStep, setRoundStep] = useState('');
    const [timer, setTimer] = useState(turnTime);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [awaitingBattle, setAwaitingBattle] = useState(false);
    const [playerHasMoved, setPlayerHasMoved] = useState(false);
    const [enemyHasMoved, setEnemyHasMoved] = useState(false);
    const [enemyFirstTurnStarted, setEnemyFirstTurnStarted] = useState(false);

    useEffect(() => {
        const shuffledDeck = Array.from({ length: 30 }, getRandomCard); // 30 карт для двоих
        const playerStart = shuffledDeck.slice(0, maxHandSize);
        const enemyStart = shuffledDeck.slice(maxHandSize, maxHandSize * 2);
        const remaining = shuffledDeck.slice(maxHandSize * 2);

        setPlayerHand(playerStart);
        setEnemyHand(enemyStart);
        setMainDeck(remaining);
        setCurrentTurn(Math.random() < 0.5 ? 'player' : 'enemy');
        setPlayerHasMoved(false);
        setEnemyHasMoved(false);
        setRoundStep('');
        setEnemyFirstTurnStarted(false);
    }, []);

    useEffect(() => {
        if (gameOver) return;
        setTimer(turnTime);
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [currentTurn, gameOver]);

    useEffect(() => {
        if (timer <= 0 && !gameOver) handlePassTurn();
    }, [timer, gameOver]);

    useEffect(() => {
        if (playerHP <= 0 || enemyHP <= 0) setGameOver(true);
    }, [playerHP, enemyHP]);

    useEffect(() => {
        if (gameOver) setGameResult(playerHP <= 0 ? 'lose' : 'win');
    }, [gameOver]);

    useEffect(() => {
        if (gameOver || (!enemyFirstTurnStarted && currentTurn !== 'enemy')) return;

        if (currentTurn === 'enemy' && (roundStep === 'player-done' || roundStep === '')) {
            setTimeout(() => {
                enemyMove(enemyMoney);
                setEnemyHasMoved(true);

                if (!playerHasMoved && !enemyFirstTurnStarted) {
                    setEnemyFirstTurnStarted(true);
                    setRoundStep('enemy-done');
                    setCurrentTurn('player');
                } else {
                    setRoundStep('enemy-done');
                    setAwaitingBattle(true);
                    handlePassTurn();
                }
            }, 500);
        }
    }, [currentTurn, roundStep, gameOver]);

    useEffect(() => {
        if (playerHasMoved && enemyHasMoved && awaitingBattle && !gameOver) {
            const battleTimeout = setTimeout(() => {
                resolveBattle();
                drawCardsForBoth();
                setRoundStep('');
                setCurrentTurn((prev) => (prev === 'player' ? 'enemy' : 'player'));
                setTimer(turnTime);
                setAwaitingBattle(false);
                setPlayerHasMoved(false);
                setEnemyHasMoved(false);
            }, 2000);
            return () => clearTimeout(battleTimeout);
        }
    }, [playerHasMoved, enemyHasMoved, awaitingBattle, gameOver]);

    function drawCardsForBoth() {
        const playerSpace = maxHandSize - playerHand.length;
        const enemySpace = maxHandSize - enemyHand.length;
        const totalNeeded = playerSpace + enemySpace;

        const cardsToDraw = mainDeck.slice(0, totalNeeded);
        const newDeck = mainDeck.slice(totalNeeded);

        const newPlayerCards = cardsToDraw.slice(0, playerSpace);
        const newEnemyCards = cardsToDraw.slice(playerSpace);

        setPlayerHand((prev) => [...prev, ...newPlayerCards]);
        setEnemyHand((prev) => [...prev, ...newEnemyCards]);
        setMainDeck(newDeck);
    }

    function resolveBattle() {
        const playerAttackSum = playerBoard.reduce((sum, card) => sum + card.attac, 0);
        const playerDefenseSum = playerBoard.reduce((sum, card) => sum + card.defense, 0);
        const enemyAttackSum = enemyBoard.reduce((sum, card) => sum + card.attac, 0);
        const enemyDefenseSum = enemyBoard.reduce((sum, card) => sum + card.defense, 0);

        const damageToPlayer = Math.max(0, enemyAttackSum - playerDefenseSum);
        const damageToEnemy = Math.max(0, playerAttackSum - enemyDefenseSum);

        setPlayerHP((hp) => Math.max(0, hp - damageToPlayer));
        setEnemyHP((hp) => Math.max(0, hp - damageToEnemy));

        setPlayerBoard([]);
        setEnemyBoard([]);
    }

    function playCard(index) {
        if (gameOver || currentTurn !== 'player') return;
        if (playerBoard.length >= maxBoardSize) return alert('No more space on the board!');

        const card = playerHand[index];
        if (playerMoney < card.price) return alert('Not enough money to play this card!');

        setPlayerMoney((m) => m - card.price);
        setPlayerBoard((board) => [...board, card]);
        setPlayerHand((hand) => hand.filter((_, i) => i !== index));
    }

    function handlePassTurn() {
        if (gameOver) return;

        if (currentTurn === 'player') {
            setPlayerMoney((m) => Math.min(20, m + 2));
            setPlayerHasMoved(true);
            setRoundStep('player-done');
            if (enemyHasMoved) setAwaitingBattle(true);
            else setCurrentTurn('enemy');
        } else if (currentTurn === 'enemy') {
            setEnemyMoney((m) => Math.min(20, m + 2));
            setEnemyHasMoved(true);
            setRoundStep('enemy-done');
            if (playerHasMoved) setAwaitingBattle(true);
            else setCurrentTurn('player');
        }

        setTimer(turnTime);
    }

    function enemyMove(money) {
        let board = [...enemyBoard];
        let hand = [...enemyHand];
        const spaceLeft = maxBoardSize - board.length;

        for (let i = 0; i < spaceLeft; i++) {
            const affordable = hand.filter((c) => money >= c.price);
            if (!affordable.length) break;
            const card = affordable[Math.floor(Math.random() * affordable.length)];
            const idx = hand.findIndex((c) => c.name === card.name);
            money -= card.price;
            board.push(card);
            hand.splice(idx, 1);
        }

        setEnemyMoney(money);
        setEnemyBoard(board);
        setEnemyHand(hand);
    }

    const player = {
        hp: playerHP,
        money: playerMoney,
        username: parseJwt(getCookie('jwt')).username,
    };

    const enemy = {
        hp: enemyHP,
        money: enemyMoney,
        username: location.state?.opponentName || 'Unknown',
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
                        <div className="enemy-deck-count">{mainDeck.length}</div>
                    </div>
                    <div className="enemy-hand hand">
                        {enemyHand.map((_, i) => (
                            <EnemyCard key={i} />
                        ))}
                    </div>
                </div>
                <div className="game-deck">
                    <div className="enemy-deck game-deck__cards">
                        {enemyBoard.map((card, i) => (
                            <Card key={i} card={card} />
                        ))}
                    </div>
                    <div className="player-deck game-deck__cards">
                        {playerBoard.map((card, i) => (
                            <Card key={i} card={card} />
                        ))}
                    </div>
                </div>
                <div className="player-hand hand">
                    {playerHand.map((card, i) => (
                        <div key={i} onClick={() => playCard(i)}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>
                <button className="game-button" onClick={handlePassTurn} disabled={gameOver}>
                    {gameOver
                        ? 'Game Over'
                        : currentTurn === 'player'
                          ? 'Pass Turn'
                          : 'Enemy Turn...'}
                </button>
                <div className={`timer ${timer <= 10 ? 'low' : ''}`}>⏳ {timer}s</div>
            </div>
            {gameResult && (
                <div className="game-result-overlay">
                    <div className="game-result-message">
                        {gameResult === 'win' ? 'You Win!' : 'You Lose!'}
                    </div>
                    <div className="game-result-buttons">
                        <button onClick={() => navigate('/')} className="game-result-button">
                            🏠 Go to the menu
                        </button>
                        <button
                            onClick={() => navigate('/find-game')}
                            className="game-result-button"
                        >
                            🔍 Find a match
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
