import React from 'react';

export default function GamePage({ onNavigate }) {
    return <div>
        <button onClick={() => onNavigate("/")}>Перейти на страницу 2</button>
    </div>;
}
