import React, { useState, useEffect } from 'react';

export default function UserAvatar({ avatarUrl, onFileSelect }) {
    const [preview, setPreview] = useState(avatarUrl);

    useEffect(() => {
        setPreview(avatarUrl);
    }, [avatarUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        onFileSelect(file);
    };

    return (
        <div className="user__avatar">
            {preview ? (
                <img src={preview} alt="avatar" className="user__avatar_img" />
            ) : (
                <div className="user__avatar_placeholder" />
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="avatarFileInput"
            />
            <label htmlFor="avatarFileInput" className="user__avatar_upload-btn">
                <img src="upload.svg" alt="" />
            </label>
        </div>
    );
}
