import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAuthModal from './UserAuthModal';
import './Services.css';

const SERVICES_DATA = [
    {
        id: 's1', title: 'Electrician', category: 'Repairs',
        description: 'Professional electrical repairs, wiring, and installations.', price: 499,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 's2', title: 'Plumber', category: 'Repairs',
        description: 'Expert plumbing fixes, leak repairs, and pipe installations.', price: 399,
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 's3', title: 'Cleaning', category: 'Cleaning',
        description: 'Deep home cleaning, sanitization, and organization.', price: 899,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 's4', title: 'Painting', category: 'Renovation',
        description: 'Interior and exterior house painting and touch-ups.', price: 1499,
        image: 'https://images.unsplash.com/photo-1511822148790-e7b58ba14c72?q=80&w=1127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 's5', title: 'AC Repair', category: 'Repairs',
        description: 'AC servicing, gas refilling, and cooling issue repairs.', price: 599,
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 's6', title: 'Carpenter', category: 'Renovation',
        description: 'Furniture repair, custom woodwork, and fittings.', price: 450,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
    }
];


const CATEGORIES = ['All', ...new Set(SERVICES_DATA.map(s => s.category))];

const Services = () => {
    const { user, isAuthenticated } = useAuth();
    const [selectedService, setSelectedService] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Booking Form State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtering Logic
    const filteredServices = SERVICES_DATA.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleBookClick = (service) => {
        if (!isAuthenticated || user?.role !== 'user') {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedService(service);
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        const bookingData = {
            userEmail: user.email,
            serviceName: selectedService.title,
            price: selectedService.price,
            date, time, address
        };

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                alert("Booking Confirmed! An expert will accept your request soon.");
                setSelectedService(null);
                setDate(''); setTime(''); setAddress('');
            } else {
                alert("Failed to book. Please try again.");
            }
        } catch (error) {
            alert("Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    // Prevent past dates
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="services-container">
            <div className="services-header">
                <h2>Our Home Services</h2>
                <p>Book trusted professionals for all your home needs.</p>

                {/* Search and Filter UI */}
                <div className="filter-controls">
                    <input
                        type="text"
                        placeholder="Search for a service... (e.g., AC Repair)"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="category-pills">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Display message if search yields no results */}
            {filteredServices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <h3>No services found.</h3>
                    <p>Try adjusting your search or category filter.</p>
                </div>
            ) : (
                <div className="services-grid">
                    {/* Render filteredServices instead of all SERVICES_DATA */}
                    {filteredServices.map(service => (
                        <div key={service.id} className="service-card">
                            <img src={service.image} alt={service.title} className="service-image" />
                            <div className="service-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h3>{service.title}</h3>
                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '100px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        {service.category}
                                    </span>
                                </div>
                                <p>{service.description}</p>
                                <div className="service-footer">
                                    <span className="service-price">₹{service.price}</span>
                                    <button onClick={() => handleBookClick(service)} className="btn-book">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <UserAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Booking Modal */}
            {selectedService && (
                <div className="modal-overlay" onClick={() => setSelectedService(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedService(null)}>&times;</button>
                        <h2 className="modal-title">Schedule Service</h2>
                        <p className="modal-subtitle">{selectedService.title}</p>

                        <form onSubmit={handleConfirmBooking} className="auth-form">
                            <input type="date" required min={minDate} className="form-input"
                                value={date} onChange={(e) => setDate(e.target.value)} />

                            <select required className="form-input" value={time} onChange={(e) => setTime(e.target.value)}>
                                <option value="">Select Time Slot</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                            </select>

                            <textarea required placeholder="Full Service Address" className="form-input" rows="3"
                                value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

                            {/* Premium styling for booking summary */}
                            <div className="booking-summary" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Estimated Total:</span>
                                <span>₹{selectedService.price}</span>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                                {loading ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
