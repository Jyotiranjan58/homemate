import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingProviders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/providers/pending');
            const data = await response.json();
            setApplications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProviders();
    }, []);

    const handleAction = async (id, actionStatus) => {
        if (!window.confirm(`Are you sure you want to ${actionStatus.toLowerCase()} this application?`)) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/providers/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: actionStatus })
            });

            const data = await response.json();

            if (data.success) {
                // Remove the processed application from the screen
                setApplications(applications.filter(app => app._id !== id));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Action failed:", error);
            alert("Server error. Please try again.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applications...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Control Panel</h1>
                <p>Manage Partner Applications</p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <h3>No pending applications</h3>
                    <p>You're all caught up! New expert registrations will appear here.</p>
                </div>
            ) : (
                <div className="applications-grid">
                    {applications.map(app => (
                        <div key={app._id} className="app-card">
                            <h3>{app.name}</h3>

                            <div className="app-details">
                                <p><strong>Email:</strong> {app.email}</p>
                                <p><strong>Mobile:</strong> {app.mobile}</p>
                                <p><strong>City:</strong> {app.city}</p>
                                <p><strong>Date Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>

                                <div style={{ marginTop: '0.8rem' }}>
                                    <strong>Services:</strong><br />
                                    {app.providedServices.map(service => (
                                        <span key={service} className="service-tag">{service}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button onClick={() => handleAction(app._id, 'Approved')} className="btn-approve">Approve</button>
                                <button onClick={() => handleAction(app._id, 'Rejected')} className="btn-reject">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;