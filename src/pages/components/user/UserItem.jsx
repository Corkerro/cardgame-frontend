import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import '../../../assets/styles/user.scss';

export default function UserItem({
    initialAvatarUrl,
    userName,
    otherClasses,
    editable = false,
    isClicked = false,
}) {
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

    useEffect(() => {
        setAvatarUrl(initialAvatarUrl);
    }, [initialAvatarUrl]);

    const handleClick = () => {
        if (!editable && isClicked) {
            window.open(`/profile/${userName}`, '_blank');
        }
    };

    return (
        <div
            className={`user__wrapper ${otherClasses}`}
            onClick={handleClick}
            style={{ cursor: !isClicked ? 'default' : 'pointer' }}
        >
            <UserAvatar
                avatarUrl={avatarUrl}
                editable={editable}
                onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
            />
            <p className="user__name">{userName}</p>
        </div>
    );
}
