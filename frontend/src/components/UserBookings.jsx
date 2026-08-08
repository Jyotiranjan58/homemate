import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserBookings.css';

const UserBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review Form State
    const [reviewingId, setReviewingId] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const fetchMyBookings = async () => {
        if (!user || !user.email) return;
        try {
            const response = await fetch(`http://localhost:5000/api/bookings/user/${user.email}`);
            const data = await response.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [user]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Accepted': return 'status-accepted';
            case 'Completed': return 'status-completed';
            default: return 'status-pending';
        }
    };

    const submitReview = async (bookingId) => {
        if (rating === 0) return alert("Please select a star rating!");

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/review`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review: reviewText })
            });

            if (response.ok) {
                alert("Thank you for your review!");
                setReviewingId(null);
                setRating(0);
                setReviewText('');
                fetchMyBookings(); // Refresh the list to show the new review
            }
        } catch (error) {
            alert("Error submitting review.");
        }
    };

    // Helper to render static gold stars for existing reviews
    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < count ? '#fbbf24' : '#cbd5e1', fontSize: '1.2rem' }}>★</span>
        ));
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your bookings...</div>;

    return (
        <div className="user-bookings-container">
            <div className="bookings-header" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>My Service History</h2>
                <p style={{ color: 'var(--text-muted)' }}>Track the status of your requested home services.</p>
            </div>

            {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ color: 'var(--text-main)' }}>No bookings found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't booked any services yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-ticket" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {booking.serviceName}
                                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </h3>

                                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    <span>📅 {booking.date} at {booking.time}</span>
                                    <span>📍 {booking.address}</span>

                                    {(booking.status === 'Accepted' || booking.status === 'Completed') && booking.providerName && (
                                        <div className="provider-info">
                                            ✅ Expert: <strong>{booking.providerName}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                <small style={{ color: 'var(--text-muted)' }}>Estimated Total</small>
                                <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>₹{booking.price}</span>
                            </div>

                            {/* --- REVIEW LOGIC --- */}

                            {/* 1. Job is completed, but NO review exists yet -> Show "Leave Review" UI */}
                            {booking.status === 'Completed' && !booking.rating && (
                                <div className="review-section">
                                    {reviewingId === booking._id ? (
                                        <div className="review-box">
                                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Rate your experience:</p>
                                            <div className="star-rating">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span
                                                        key={star}
                                                        className={`star ${star <= rating ? 'active' : ''}`}
                                                        onClick={() => setRating(star)}
                                                    >★</span>
                                                ))}
                                            </div>
                                            <textarea
                                                className="review-input"
                                                rows="2"
                                                placeholder="Write a short review..."
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                            ></textarea>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => submitReview(booking._id)} className="btn-review">Submit Review</button>
                                                <button onClick={() => setReviewingId(null)} className="btn-review" style={{ background: '#e2e8f0', color: 'var(--text-main)' }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setReviewingId(booking._id)} className="btn-review">
                                            ⭐️ Leave a Review
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* 2. Job is completed, AND a review exists -> Show the existing review */}
                            {booking.status === 'Completed' && booking.rating && (
                                <div className="display-review">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Your Rating:</span>
                                        <div>{renderStars(booking.rating)}</div>
                                    </div>
                                    {booking.review && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>"{booking.review}"</p>}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;