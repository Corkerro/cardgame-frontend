import React, { useState, useEffect } from 'react';
import '../../assets/styles/game/gamepage.scss';
import '../../assets/styles/game/card.scss';
import Player from './Player.jsx';
import Card from './Card.jsx';
import EnemyCard from './EnemyCard.jsx';
import parseJwt from '../../components/ParseJwt.js';
import getCookie from '../../components/GetCookie.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNamespaceSocket } from '../../components/MultiSocketContext.jsx';

const initialHP = 20;
const maxHandSize = 5;
const maxBoardSize = 5;
const turnTime = 20;

export default function GamePage({ onNavigate }) {
    const socket = useNamespaceSocket('game');

    const location = useLocation();
    const navigate = useNavigate();

    const [playerHP, setPlayerHP] = useState(initialHP);
    const [enemyHP, setEnemyHP] = useState(initialHP);
    const [mainDeck, setMainDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [enemyHandLength, setEnemyHandLength] = useState(0);
    const [playerBoard, setPlayerBoard] = useState([]);
    const [enemyBoard, setEnemyBoard] = useState([]);
    const [playerMoney, setPlayerMoney] = useState(20);
    const [enemyMoney, setEnemyMoney] = useState(20);
    const [currentTurn, setCurrentTurn] = useState('');
    const [timer, setTimer] = useState(turnTime);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [awaitingBattle, setAwaitingBattle] = useState(false);
    const [playerHasMoved, setPlayerHasMoved] = useState(false);
    const [enemyHasMoved, setEnemyHasMoved] = useState(false);

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
        if (playerHasMoved && enemyHasMoved && awaitingBattle && !gameOver) {
            const battleTimeout = setTimeout(() => {
                resolveBattle();
                drawCardsForBoth();
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
        const enemySpace = maxHandSize - enemyHandLength;
        const totalNeeded = playerSpace + enemySpace;

        const cardsToDraw = mainDeck.slice(0, totalNeeded);
        const newDeck = mainDeck.slice(totalNeeded);

        const newPlayerCards = cardsToDraw.slice(0, playerSpace);
        const newEnemyCardsCount = cardsToDraw.length - newPlayerCards.length;

        setPlayerHand((prev) => [...prev, ...newPlayerCards]);
        setEnemyHandLength((prev) => prev + newEnemyCardsCount);
        setMainDeck(newDeck);
    }

    function resolveBattle() {
        const playerAttackSum = playerBoard.reduce((sum, card) => sum + card.damage, 0);
        const playerDefenseSum = playerBoard.reduce((sum, card) => sum + card.defence, 0);
        const enemyAttackSum = enemyBoard.reduce((sum, card) => sum + card.damage, 0);
        const enemyDefenseSum = enemyBoard.reduce((sum, card) => sum + card.defence, 0);

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
        if (playerMoney < card.cost) return alert('Not enough money to play this card!');

        socket.emit(
            'playCard',
            {
                gameId: Number(location.state.gameId),
                cardId: playerHand[index].id || playerHand[index].name,
            },
            (res) => {
                if (res.success) {
                    setPlayerHasMoved(true);
                } else {
                    alert('Failed to play card: ' + res.error);
                }
            },
        );
    }

    function handlePassTurn() {
        if (gameOver) return;

        socket.emit('passRound', { gameId: Number(location.state.gameId) }, (res) => {
            if (res.success) {
                const currentPlayerUsername = res.data.currentPlayerUsername;
                setCurrentTurn(currentPlayerUsername === player.username ? 'player' : 'enemy');
            } else {
                alert('Failed to pass turn: ' + res.error);
            }
        });
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

    useEffect(() => {
        function updateGameState(game) {
            const currentPlayerUsername = game.currentPlayerUsername;

            const me = game.players.find((p) => p.username === player.username);
            const opponent = game.players.find((p) => p.username !== player.username);

            setPlayerHP(me.hp);
            setEnemyHP(opponent.hp);
            setPlayerHand(me.cards);
            setEnemyHandLength(opponent.cardsCount ?? opponent.cards.length);
            setPlayerBoard(me.playedCards);
            setEnemyBoard(opponent.playedCards);
            setPlayerMoney(me.coins);
            setEnemyMoney(opponent.coins);

            setCurrentTurn(currentPlayerUsername === player.username ? 'player' : 'enemy');
        }

        if (!location.state?.gameId) return;

        socket.emit(
            'joinGame',
            {
                gameId: Number(location.state.gameId),
                username: player.username,
            },
            (res) => {
                if (res.success) {
                    updateGameState(res.data);
                    console.log(res.data);
                } else {
                    console.error('Failed to join game:', res.message);
                }
            },
        );

        socket.on('gameStateUpdate', (game) => {
            updateGameState(game);
        });

        return () => {
            socket.off('gameStateUpdate');
        };
    }, [socket, location.state?.gameId, player.username]);

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
                        {Array.from({ length: enemyHandLength }).map((_, i) => (
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
                <div
                    className="player-hand hand"
                    style={{ pointerEvents: currentTurn === 'player' ? 'auto' : 'none' }}
                >
                    {playerHand.map((card, i) => (
                        <div key={i} onClick={() => playCard(i)}>
                            <Card card={card} />
                        </div>
                    ))}
                </div>
                <button
                    className="game-button"
                    onClick={handlePassTurn}
                    disabled={gameOver || currentTurn !== 'player'}
                >
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
