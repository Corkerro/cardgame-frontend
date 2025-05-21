import React from 'react';

export default function UserAvatar({ avatarUrl }) {
    return (
        <div className="user__avatar">
            <div className={`user__avatar_placeholder ${avatarUrl}`}></div>
        </div>
    );
}
