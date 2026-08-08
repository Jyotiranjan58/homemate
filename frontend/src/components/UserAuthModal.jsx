import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const UserAuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Notice the 'user' parameter passed to our context functions!
        if (isLogin) {
            const res = await login(formData.email, formData.password, 'user');
            if (res.success) {
                onClose();
            } else {
                setError(res.message);
            }
        } else {
            const res = await signup(formData, 'user');
            if (res.success) {
                setIsLogin(true); // Switch to login view after successful signup
                setError('Signup successful! Please log in.');
            } else {
                setError(res.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                <p className="modal-subtitle">
                    {isLogin ? 'Login to book your next home service.' : 'Sign up to get started as a customer.'}
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <input type="text" name="name" placeholder="Full Name" required
                            className="form-input" value={formData.name} onChange={handleChange} />
                    )}
                    <input type="email" name="email" placeholder="Email Address" required
                        className="form-input" value={formData.email} onChange={handleChange} />
                    {!isLogin && (
                        <input type="tel" name="mobile" placeholder="10-digit Mobile Number" required minLength="10" maxLength="10"
                            className="form-input" value={formData.mobile} onChange={handleChange} />
                    )}
                    <input type="password" name="password" placeholder="Password" required minLength="6"
                        className="form-input" value={formData.password} onChange={handleChange} />

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="switch-auth">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? 'Sign up here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default UserAuthModal;