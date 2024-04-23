import React from 'react';
import { View, Alert } from 'react-native';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const navigation = useNavigation();
  const [value, setValue] = React.useState('account');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5281/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          "twoFactorCode": "string",
          "twoFactorRecoveryCode": "string"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.accessToken);
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        navigation.navigate('index');
        Alert.alert('Success', 'Youre logged in.');

      } else {
        // Handle login error
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
    </View>
  );
}
