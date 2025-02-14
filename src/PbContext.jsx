import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BASE_URL = import.meta.env.VITE_PB_URI;

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define user
    const [user, setUser] = useState(pb.authStore.record);
    const [token, setToken] = useState(pb.authStore.token)

    useEffect(() => {
        if (pb.authStore.isValid) {
            // refresh auth token
            pb.collection("users").authRefresh();
        }
        
        // listen for changes to the authStore state
        const unsubscribe = pb.authStore.onChange((token, record) => {
            setUser(record);
            setToken(token);
        });
        
        return () => {
            unsubscribe();
        };
    }, [pb.authStore.record]);


    // ========= AUTH ==============

    const googleAuth = async () => {
        const res = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    }

    const login = async (email, pass) => {
        // attempt to login user
        try {
            await pb.collection("users").authWithPassword(email, pass);
            setUser(pb.authStore.record);
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    const signup = async (data) => {
        // attempt to register user
        try {
            const res = await pb.collection("users").create(data);

            // log in user
            await login(data.email, data.password);
            
            return null;
        }
        catch (err) {
            console.log(err.data)
            return err;
        }
    }

    const logout = () => {
        try {
            pb.authStore.clear();
            setUser(pb.authStore.record);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <PbContext.Provider value={{ 
            user,
            googleAuth,
            login,
            logout,
            signup,
         }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);