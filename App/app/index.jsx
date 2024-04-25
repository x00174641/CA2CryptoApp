import React, { useEffect, useState } from 'react';
import { View, Alert, Image, FlatList, TouchableOpacity , StyleSheet } from 'react-native';
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
import { router } from 'expo-router';
import {useTranslation} from 'react-i18next';


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
    const [visible, setVisible] = useState(false);

    const getUserInfo = async () => {
        try {
            const response = await fetch('http://159.65.21.195/manage/info', {
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
            const response = await fetch('http://159.65.21.195/login', {
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
                router.replace('/(tabs)/portfolio');
                Alert.alert(t('success'), t('logged_in'), [
                    {
                        text: 'OK', onPress: () => {
                        }
                    }
                ]);
            } else {
                Alert.alert(t('error'), t('invalid_credentials'));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://159.65.21.195/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
    
            console.log("Register Response:", response); // Add this line
    
            // Let's check the status of the response
            console.log("Response status:", response.status);
    
            if (response.status === 200) {
                Alert.alert(t('success'), t('registration_successful'), [
                    {
                        text: 'OK', onPress: () => {
                        }
                    }
                ]);
            } else {
                Alert.alert(t('error'), t('registration_failed'));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const {t} = useTranslation();

    return (
      
            <View>
                <Tabs
                    value={value}
                    onValueChange={setValue}
                    className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
                >
                    <TabsList className='flex-row w-full'>
                        <TabsTrigger value='account' className='flex-1'>
                            <Text>{t('login')}</Text>
                        </TabsTrigger>
                        <TabsTrigger value='signup' className='flex-1'>
                            <Text>{t('signup_title')}</Text>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='account'>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('login')}</CardTitle>
                                <CardDescription>
                                    {t('login_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='gap-4 native:gap-2'>
                                <View className='gap-1'>
                                    <Label nativeID='Username'>{t('email')}</Label>
                                    <Input
                                        aria-aria-labelledby='Username'
                                        placeholder={t('email')}
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                    />
                                </View>
                                <View className='gap-1'>
                                    <Label nativeID='Password'>{t('password')}</Label>
                                    <Input
                                        id='password'
                                        placeholder={t('password')}
                                        secureTextEntry
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                </View>
                            </CardContent>
                            <CardFooter>
                                <Button onPress={handleLogin}>
                                    <Text>{t('login')}</Text>
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value='signup'>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('signup_title')}</CardTitle>
                                <CardDescription>
                                    {t('signup_description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='gap-4 native:gap-2'>
                                <View className='gap-1'>
                                    <Label nativeID='Email'>{t('email')}</Label>
                                    <Input
                                        aria-aria-labelledby='email'
                                        placeholder={t('email')}
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                    />
                                </View>
                                <View className='gap-1'>
                                    <Label nativeID='Password'>{t('password')}</Label>
                                    <Input
                                        id='password'
                                        placeholder={t('password')}
                                        secureTextEntry
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                </View>
                            </CardContent>
                            <CardFooter>
                                <Button onPress={handleRegister}>
                                    <Text>{t('register')}</Text>
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#191266',
    },
    button: {
      backgroundColor: '#6258e8',
      padding: 10,
      borderRadius: 3,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
    text: {
      marginBottom: 100,
      fontSize: 18,
      color: 'white',
    },
    languagesList: {
      flex: 1,
      justifyContent: 'center',
      padding: 10,
      backgroundColor: '#6258e8',
    },
  
    languageButton: {
      padding: 10,
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
    },
    lngName: {
      fontSize: 16,
      color: 'white',
    },
  });
