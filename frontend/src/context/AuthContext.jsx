import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api/auth';

    useEffect(() => {
        
        const storedUser = localStorage.getItem('homemate_session');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('homemate_session');
            }
        }
        setLoading(false);
    }, []);

    // Signup Function (Handles both User and Provider)
    const signup = async (formData, type) => {
        // 'type' must be exactly 'user' or 'provider'
        try {
            const response = await fetch(`${API_URL}/${type}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            return await response.json();
        } catch (error) {
            console.error(`${type} Signup Error:`, error);
            return { success: false, message: "Server connection failed." };
        }
    };

    // LOGIN FUNCTION (Handles both User and Provider)
    const login = async (email, password, type) => {
        // 'type' must be exactly 'user' or 'provider'
        try {
            const response = await fetch(`${API_URL}/${type}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user); // The backend 'role' field is inside this object
                setIsAuthenticated(true);
                localStorage.setItem('homemate_session', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error(`${type} Login Error:`, error);
            return { success: false, message: "Server connection failed." };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('homemate_session');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, signup, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
