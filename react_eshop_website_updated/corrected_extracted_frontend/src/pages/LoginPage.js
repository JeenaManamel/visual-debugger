import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await loginUser(email, password); // Backend call
            localStorage.setItem('token', userData.token);
            onLogin(userData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please sign in to continue</p>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>
                </form>
                {error && <p className="login-error">{error}</p>}
            </div>
        </div>
    );
}

LoginPage.defaultProps = {
    onLogin: () => { },
};

export default LoginPage;
