import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserAvatar({ avatarUrl, onAvatarChange, editable }) {
    const [preview, setPreview] = useState(avatarUrl);
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!uploading) {
            setPreview(avatarUrl);
            setImgError(false);
        }
    }, [avatarUrl, uploading]);

    const handleFileSelect = async (file) => {
        if (!file || !editable) return;

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);

        try {
            const response = await axios.post(`${baseURL}/users/avatar`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newAvatarUrl = `${baseURL}/avatars/${response.data.avatarUrl}?t=${Date.now()}`;
            setPreview(newAvatarUrl);
            onAvatarChange && onAvatarChange(newAvatarUrl);

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
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setImgError(false);

        handleFileSelect(file).finally(() => {
            URL.revokeObjectURL(objectUrl);
        });
    };

    const handleImgError = () => {
        setImgError(true);
    };

    return (
        <div className="user__avatar">
            {!imgError && preview ? (
                <img
                    src={preview}
                    alt="avatar"
                    className="user__avatar_img"
                    onError={handleImgError}
                />
            ) : (
                <div className="user__avatar_placeholder" />
            )}
            {editable && (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="avatarFileInput"
                        disabled={uploading}
                    />
                    <label htmlFor="avatarFileInput" className="user__avatar_upload-btn">
                        <img src="upload.svg" alt="upload icon" />
                    </label>
                </>
            )}
        </div>
    );
}
