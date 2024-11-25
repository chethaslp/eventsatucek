"use client";
import React from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { app } from '@/components/fb/config';
import Loading from '@/components/ui/Loading';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

export const AuthContext = React.createContext<User | null>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode} ) => {
    const auth = getAuth(app);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={ user }>
                {loading ? <Loading msg="Authenticating..."/> : children}
        </AuthContext.Provider>
    );
};

export type {User}