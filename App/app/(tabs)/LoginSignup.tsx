import React, { useEffect, useState } from 'react';
import { View, Alert, Image } from 'react-native';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { AntDesign } from '@expo/vector-icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useToken from '~/components/hooks/Token';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { useNavigation } from 'expo-router';
import useFetchUserId from '~/components/hooks/FetchUserId';

export default function Screen() {
    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: 12,
        right: 12,
    };
    const navigation = useNavigation();
    const [selectedCrypto, setSelectedCrypto] = useState("BTC");
    const [inputValue, setInputValue] = useState("");
    const { token } = useToken();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [value, setValue] = useState('account');
    const [email, setEmail] = useState('');
    const userId = useFetchUserId();
    const [portfolioData, setPortfolioData] = useState([]);
    const [totalAssets, setTotalAssets] = useState(null);

    const getUserInfo = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5281/manage/info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setUserEmail(data.email);
            } else {
                setUserEmail('');
            }
        } catch (error) {
            console.error('Errorsssss:', error);
        }
    };

    useEffect(() => {
        const updateUserInfo = async () => {
            if (userEmail) {
                await getUserInfo();
            } 
        };
    
        updateUserInfo();
    
        const interval = setInterval(updateUserInfo, 60000);
    
        return () => clearInterval(interval);
    }, [userEmail, token]);
   
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
    
                getUserInfo();
    
                setUserEmail(email);
    
                Alert.alert('Success', 'You are logged in.', [
                    {
                        text: 'OK', onPress: () => {
                            navigation.navigate('index');
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', 'Invalid email or passwords');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    

    return (
        <View style={{ flex: 1, gap: 1, padding: 3 }}>
                <View>
                    <Tabs
                        value={value}
                        onValueChange={setValue}
                        className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
                    >
                        <TabsList className='flex-row w-full'>
                            <TabsTrigger value='account' className='flex-1'>
                                <Text>Account</Text>
                            </TabsTrigger>
                            <TabsTrigger value='password' className='flex-1'>
                                <Text>Password</Text>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='account'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>
                                        Login to your portfolio
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='gap-4 native:gap-2'>
                                    <View className='gap-1'>
                                        <Label nativeID='Username'>Email</Label>
                                        <Input
                                            aria-aria-labelledby='Username'
                                            placeholder='Username'
                                            value={email}
                                            onChangeText={(text) => setEmail(text)}
                                        />
                                    </View>
                                    <View className='gap-1'>
                                        <Label nativeID='Password'>Password</Label>
                                        <Input
                                            id='password'
                                            placeholder='Password'
                                            secureTextEntry
                                            value={password}
                                            onChangeText={(text) => setPassword(text)}
                                        />
                                    </View>
                                </CardContent>
                                <CardFooter>
                                    <Button onPress={handleLogin}>
                                        <Text>Login</Text>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value='password'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving, you'll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='gap-4 native:gap-2'>
                                    <View className='gap-1'>
                                        <Label nativeID='current'>Current password</Label>
                                        <Input placeholder='********' aria-labelledby='current' secureTextEntry />
                                    </View>
                                    <View className='gap-1'>
                                        <Label nativeID='new'>New password</Label>
                                        <Input placeholder='********' aria-labelledby='new' secureTextEntry />
                                    </View>
                                </CardContent>
                                <CardFooter>
                                    <Button>
                                        <Text>Save password</Text>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </View>
        </View>
    );
}
