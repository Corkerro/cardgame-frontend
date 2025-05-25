import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import '../../../assets/styles/user.scss';

export default function UserItem({ initialAvatarUrl, userName, otherClasses, editable = false }) {
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

    useEffect(() => {
        setAvatarUrl(initialAvatarUrl);
    }, [initialAvatarUrl]);

    return (
        <div className={`user__wrapper ${otherClasses}`}>
            <UserAvatar
                avatarUrl={avatarUrl}
                editable={editable}
                onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
            />
            <p className="user__name">{userName}</p>
        </div>
    );
}
