import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useToken() {
    const [token, setToken] = React.useState(null);
  
    React.useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                setToken(storedToken);
            } catch (error) {
                console.error('Error getting token:', error);
            }
        };
        getToken();
    }, []);
  
    return { token };
}
