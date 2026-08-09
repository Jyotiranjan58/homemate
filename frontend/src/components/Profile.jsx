import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const AVAILABLE_SERVICES = ['Electrician', 'Plumber', 'Carpenter', 'Cleaning', 'Painting', 'AC Repair'];

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        city: user?.city || '',
        providedServices: user?.providedServices || []
    });

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
        setLoading(true);

        const role = user.role.toLowerCase();

        try {
            const response = await fetch(`http://localhost:5000/api/auth/${role}/${user.email}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert("Profile updated successfully!");
                
                localStorage.setItem('homemate_session', JSON.stringify(data.user));
                window.location.reload();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Account Settings</h2>
                <p>Manage your personal information and preferences.</p>
            </div>

            <div className="profile-card">
                <form onSubmit={handleSubmit} className="profile-form">

                    <div className="form-row">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="name" className="profile-input"
                                value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Email Address (Cannot be changed)</label>
                            <input type="email" className="profile-input" value={user.email} disabled />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="mobile" className="profile-input"
                                value={formData.mobile} onChange={handleChange} required minLength="10" maxLength="10" />
                        </div>

                        {/* Only show City for Providers */}
                        {user.role === 'provider' && (
                            <div className="input-group">
                                <label>Operating City</label>
                                <input type="text" name="city" className="profile-input"
                                    value={formData.city} onChange={handleChange} required />
                            </div>
                        )}
                    </div>

                    {/* Only show Services Grid for Providers */}
                    {user.role === 'provider' && (
                        <div className="input-group" style={{ marginTop: '1rem' }}>
                            <label>Services You Offer</label>
                            <div className="services-edit-grid">
                                {AVAILABLE_SERVICES.map(service => (
                                    <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.providedServices.includes(service)}
                                            onChange={() => handleServiceToggle(service)}
                                            style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }}
                                        />
                                        {service}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-save" disabled={loading}>
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
