import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Get the bearer token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await fetch('http://10.0.2.2:5281/api/User/fetchId', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.text(); // Read response as text
            console.log(data)
            setUserId(data); // Set user ID directly from text response
          } else {
            console.error('Failed to fetch user ID');
          }
        } else {
          console.error('Bearer token not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  return userId;
};

export default useFetchUserId;
