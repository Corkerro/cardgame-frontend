import { toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';
import PasswordInput from '../../components/forms/PasswordInput';
import FormInput from '../../components/forms/FormInput';
import SubmitInput from '../../components/forms/SubmitInput';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            toast.error('Passwords do not match');
            return;
        }

        const baseURL = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.post(`${baseURL}/auth/register`, {
                username: formData.username,
                password: formData.password,
            });

            localStorage.setItem('jwt', response.data);
            toast.success('Successfully registered!');
        } catch (error) {
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold' }}>Registration failed!</div>
                    <div style={{ fontSize: '0.9rem' }}>
                        {typeof error.response?.data === 'string'
                            ? error.response.data.replace(/^"|"$/g, '')
                            : error.response?.data?.message || error.message}
                    </div>
                </div>,
            );
            console.error('Registration failed:', error.response?.data || error.message);
        }
    };

    return (
        <form className="forms__form register" onSubmit={handleSubmit}>
            <h1>Register</h1>
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
            <PasswordInput
                placeholder="Password confirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
            />
            <SubmitInput value="Register" name="register_submit" />
        </form>
    );
}
