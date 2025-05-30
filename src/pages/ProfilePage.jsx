import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/profile.scss';
import UserItem from './components/user/UserItem';
import getCookie from '../components/GetCookie.js';
import parseJwt from '../components/ParseJwt.js';
import { useNavigate, useParams } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartMode, setChartMode] = useState('percent'); // 'percent' | 'cum'

    const navigate = useNavigate();
    const { username: routeUsername } = useParams();
    const jwt = getCookie('jwt');
    const myUsername = parseJwt(jwt)?.username;
    const username = routeUsername || myUsername;
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                setUserData(response.data);
            } catch (err) {
                if (err.response?.status === 400) {
                    setError('Player not found');
                } else {
                    setError('Failed to fetch user data');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, jwt]);

    if (loading) return <div className="profile__container">Loading...</div>;

    if (error) {
        return (
            <div className="profile">
                <div className="profile__container error">
                    <h1>{error}</h1>
                    <button className="button profile__button" onClick={() => navigate('/')}>
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    const { gamesCount, winsCount, lossesCount, winrate, games } = userData;

    let winCount = 0;
    let cumValue = 0;
    const chartData = games
        .slice()
        .reverse()
        .map((game, index) => {
            const currentGameNumber = index + 1;
            if (game.win) winCount++;
            cumValue += game.win ? 1 : -1;

            return {
                name: new Date(game.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                win: game.win,
                cumValue,
                winratePercent: Math.round((winCount / currentGameNumber) * 100),
            };
        });

    const renderCustomDot = (props) => {
        const { cx, cy, payload, index } = props;
        if (cx === undefined || cy === undefined) return null;
        const color = payload.win ? '#4ade80' : '#ef4444';
        return (
            <circle
                key={index}
                cx={cx}
                cy={cy}
                r={6}
                fill={color}
                stroke="#333"
                strokeWidth={1}
                style={{ cursor: 'pointer' }}
            />
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const color = data.win ? '#4ade80' : '#ef4444';
            return (
                <div
                    style={{
                        backgroundColor: '#fff',
                        border: `1px solid ${color}`,
                        padding: '5px 10px',
                        color,
                        fontWeight: 'bold',
                        borderRadius: 4,
                    }}
                >
                    {data.win ? 'Win' : 'Loss'} –{' '}
                    {chartMode === 'percent'
                        ? `${data.winratePercent}%`
                        : `${data.cumValue}`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="profile">
            <div className="profile__container">
                <img src="/logo.png" alt="Acehole" />

                <UserItem
                    userName={username}
                    editable={false}
                    otherClasses={'center'}
                    initialAvatarUrl={`${baseURL}/avatars/${username}_ava.jpg`}
                />

                <div className="stats">
                    <p>
                        <strong>Games:</strong> {gamesCount}
                    </p>
                    <p>
                        <strong>Wins:</strong> {winsCount}
                    </p>
                    <p>
                        <strong>Losses:</strong> {lossesCount}
                    </p>
                    <p>
                        <strong>Winrate:</strong> {winrate}%
                    </p>
                </div>

                <div style={{ width: '100%', height: 300, marginBottom: 40 }}>
                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                        <button
                            className="button chart__toggle profile__button small"
                            onClick={() =>
                                setChartMode(chartMode === 'percent' ? 'cum' : 'percent')
                            }
                        >
                            Switch to {chartMode === 'percent' ? 'Cumulative' : 'Winrate (%)'}
                        </button>
                    </div>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={chartMode === 'percent' ? [0, 100] : ['auto', 'auto']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey={chartMode === 'percent' ? 'winratePercent' : 'cumValue'}
                                stroke="#4ade80"
                                strokeWidth={2}
                                dot={renderCustomDot}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <button className="button profile__button" onClick={() => navigate('/')}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
}
