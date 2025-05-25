import { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../../components/forms/PasswordInput';
import FormInput from '../../components/forms/FormInput';
import SubmitInput from '../../components/forms/SubmitInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseURL = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.post(`${baseURL}/auth/login`, formData, {
                withCredentials: true,
            });

            toast.success('Successfully authorized!');
            navigate('/');
        } catch (error) {
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold' }}>Authorization error!</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        {typeof error.response?.data === 'string'
                            ? error.response.data.replace(/^"|"$/g, '')
                            : error.response?.data?.message || error.message}
                    </div>
                </div>,
            );
            console.error('Login error:', error.response?.data || error.message);
        }
    };

    return (
        <form className="forms__form login" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <FormInput
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
            />
            <PasswordInput
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <SubmitInput value="Login" name="login_submit" />
        </form>
    );
}
