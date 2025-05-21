import { useState } from 'react';
import '../../../assets/styles/forms/input.password.scss';

export default function PasswordInput({ name, placeholder, value, onChange }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input input-password">
            <input
                type={showPassword ? 'text' : 'password'}
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <button type="button" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? '🙈' : '👁️'}
            </button>
        </div>
    );
}
