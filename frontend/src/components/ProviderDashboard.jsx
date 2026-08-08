import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const [availableJobs, setAvailableJobs] = useState([]);
    const [myJobs, setMyJobs] = useState([]); // Holds both Accepted and Completed jobs
    const [activeTab, setActiveTab] = useState('available'); // available, active, completed
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!user || !user.email) return;

        try {
            // 1. Fetch New/Pending Jobs matching skills
            const availableRes = await fetch('http://localhost:5000/api/bookings/available', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ services: user.providedServices })
            });
            const availableData = await availableRes.json();

            // 2. Fetch Jobs accepted by this specific provider
            const myJobsRes = await fetch(`http://localhost:5000/api/bookings/provider/${user.email}`);
            const myJobsData = await myJobsRes.json();

            setAvailableJobs(Array.isArray(availableData) ? availableData : []);
            setMyJobs(Array.isArray(myJobsData) ? myJobsData : []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for new requests every 15 seconds
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [user]);

    // --- ACTIONS ---
    const handleAcceptJob = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${jobId}/accept`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerEmail: user.email, providerName: user.name })
            });
            if (res.ok) {
                fetchData(); // Refresh all data to move job from Available to Active
                setActiveTab('active'); // Auto-switch to active tab
            }
        } catch (error) {
            alert("Error accepting job.");
        }
    };

    const handleCompleteJob = async (jobId) => {
        if (!window.confirm("Mark this job as successfully completed?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${jobId}/complete`, { method: 'PUT' });
            if (res.ok) {
                fetchData(); // Refresh data to update revenue
            }
        } catch (error) {
            alert("Error completing job.");
        }
    };

    // --- DERIVED DATA ---
    const activeJobs = myJobs.filter(job => job.status === 'Accepted');
    const completedJobs = myJobs.filter(job => job.status === 'Completed');

    // Calculate total revenue from completed jobs
    const totalRevenue = completedJobs.reduce((sum, job) => sum + job.price, 0);

    // --- RENDER HELPERS ---
    const renderJobsGrid = (jobs, type) => {
        if (jobs.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No {type} jobs found</h3>
                    <p>When jobs appear here, you can manage them easily.</p>
                </div>
            );
        }

        return (
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job._id} className="job-card">
                        <div className="job-header">
                            <div>
                                <h3>{job.serviceName}</h3>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{job.date} • {job.time}</span>
                            </div>
                            <span className="job-price">₹{job.price}</span>
                        </div>

                        <div className="job-details">
                            <p><strong>📍 Address:</strong><br />{job.address}</p>
                            <p style={{ marginTop: '0.5rem' }}><strong>👤 Customer:</strong><br />{job.userEmail}</p>
                        </div>

                        {type === 'available' && (
                            <button onClick={() => handleAcceptJob(job._id)} className="btn-action btn-accept">
                                Accept Job
                            </button>
                        )}
                        {type === 'active' && (
                            <button onClick={() => handleCompleteJob(job._id)} className="btn-action btn-complete">
                                Mark as Completed
                            </button>
                        )}
                        {type === 'completed' && (
                            <div className="status-label">✅ Job Finished & Paid</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your workspace...</div>;

    return (
        <div className="dashboard-container">
            {/* Top Revenue Card */}
            <div className="revenue-card">
                <div className="revenue-info">
                    <h1>Total Earnings</h1>
                    <div className="revenue-amount">₹{totalRevenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="revenue-stats">
                    <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Jobs Completed</p>
                    <h2 style={{ fontSize: '2rem' }}>{completedJobs.length}</h2>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dash-tabs">
                <button
                    className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    New Requests ({availableJobs.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Jobs ({activeJobs.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    History
                </button>
            </div>

            {/* Dynamic Content Area */}
            {activeTab === 'available' && renderJobsGrid(availableJobs, 'available')}
            {activeTab === 'active' && renderJobsGrid(activeJobs, 'active')}
            {activeTab === 'completed' && renderJobsGrid(completedJobs, 'completed')}

        </div>
    );
};

export default ProviderDashboard;