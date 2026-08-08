import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProviderAuth.css';
import './AuthModal.css'; // Reusing standard form classes

const AVAILABLE_SERVICES = ['Electrician', 'Plumber', 'Carpenter', 'Cleaning', 'Painting', 'AC Repair'];

const ProviderAuth = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', password: '', city: '', providedServices: []
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceToggle = (service) => {
        setFormData(prev => {
            const services = prev.providedServices.includes(service)
                ? prev.providedServices.filter(s => s !== service)
                : [...prev.providedServices, service];
            return { ...prev, providedServices: services };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        if (isLogin) {
            const res = await login(formData.email, formData.password, 'provider');
            if (res.success) {
                navigate('/'); // Or navigate to a specific Provider Dashboard route later
            } else {
                setError(res.message);
            }
        } else {
            if (formData.providedServices.length === 0) {
                setError('Please select at least one service you provide.');
                setLoading(false);
                return;
            }

            const res = await signup(formData, 'provider');
            if (res.success) {
                setSuccessMsg('Application submitted! Please wait for Admin approval before logging in.');
                setIsLogin(true); // Switch to login view
            } else {
                setError(res.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="provider-auth-container">
            <div className="provider-card">
                <div className="provider-header">
                    <h2>{isLogin ? 'Expert Login' : 'Partner with Homemate'}</h2>
                    <p>{isLogin ? 'Access your dashboard and manage bookings.' : 'Join our network of top-rated professionals.'}</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMsg && <div className="info-box">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <input type="text" name="name" placeholder="Full Name" required
                                className="form-input" value={formData.name} onChange={handleChange} />
                            <input type="tel" name="mobile" placeholder="10-digit Mobile Number" required minLength="10" maxLength="10"
                                className="form-input" value={formData.mobile} onChange={handleChange} />
                            <input type="text" name="city" placeholder="Your City" required
                                className="form-input" value={formData.city} onChange={handleChange} />

                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Services You Provide:</label>
                                <div className="services-grid">
                                    {AVAILABLE_SERVICES.map(service => (
                                        <label key={service} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.providedServices.includes(service)}
                                                onChange={() => handleServiceToggle(service)}
                                            />
                                            {service}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <input type="email" name="email" placeholder="Email Address" required
                        className="form-input" value={formData.email} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" required minLength="6"
                        className="form-input" value={formData.password} onChange={handleChange} />

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Submit Application')}
                    </button>
                </form>

                <p className="switch-auth">
                    {isLogin ? "Want to join as a professional? " : "Already an approved partner? "}
                    <span onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}>
                        {isLogin ? 'Apply here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ProviderAuth;