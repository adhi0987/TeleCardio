import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';


interface AuthContextType {
    user: User | null;
    token: string | null;
    role: string | null;
    login: (userData: User, authToken: string, userRole: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    const login = (userData: User, authToken: string, userRole: string) => {
        setToken(authToken);
        setRole(userRole);
        setUser(userData);
        localStorage.setItem('token', authToken);
        localStorage.setItem('role', userRole);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setUser(null);
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};