import { useState } from 'react';
import '../../assets/styles/login.scss';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function AuthPage() {
    const [isLoginShown, setIsLoginShown] = useState(true);

    const toggleContent = () => {
        setIsLoginShown((prev) => !prev);
    };

    return (
        <div className="forms">
            <div className="forms__container">
                <div className={`forms__content l-content ${!isLoginShown ? '' : 'hidden'}`}>
                    <h2>Already have an account?</h2>
                    <button onClick={toggleContent}>Login</button>
                </div>
                <LoginForm />
                <RegisterForm />
                <div className={`forms__content r-content ${!isLoginShown ? 'hidden' : ''}`}>
                    <h2>Haven't an account yet?</h2>
                    <button onClick={toggleContent}>Register</button>
                </div>
            </div>
        </div>
    );
}
