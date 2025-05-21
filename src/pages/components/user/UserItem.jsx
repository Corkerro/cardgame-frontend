import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserAvatar from './UserAvatar';
import '../../../assets/styles/user.scss';

export default function UserItem({ initialAvatarUrl, userName, otherClasses, editable = false }) {
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

    const handleFileSelect = async (file) => {
        if (!file || !editable) return;

        const objectUrl = URL.createObjectURL(file);
        setAvatarUrl(objectUrl);

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(`${baseURL}/user/avatar-upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });

            setAvatarUrl(response.data.avatarUrl);
            toast.success('Avatar updated successfully!');
        } catch (error) {
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold' }}>Avatar upload error!</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        {typeof error.response?.data === 'string'
                            ? error.response.data.replace(/^"|"$/g, '')
                            : error.response?.data?.message || error.message}
                    </div>
                </div>,
            );
            console.error('Avatar upload error:', error.response?.data || error.message);
            setAvatarUrl(initialAvatarUrl);
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    };

    return (
        <div className={`user__wrapper ${otherClasses}`}>
            <UserAvatar avatarUrl={avatarUrl} onFileSelect={editable ? handleFileSelect : null} />
            <p className="user__name">{userName}</p>
        </div>
    );
}
