import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
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
        getUserInfo();
    }, [token]);

    const handleAddCrypto = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5281/add-crypto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    crypto: selectedCrypto,
                    amount: inputValue,
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Crypto added to your portfolio.');
            } else {
                // Handle error
                Alert.alert('Error', 'Failed to add crypto to your portfolio.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

                await getUserInfo();

                setUserEmail(email);

                Alert.alert('Success', 'You are logged in.', [
                    {
                        text: 'OK', onPress: () => {
                            navigation.navigate('index');
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={{ flex: 1, gap: 1, padding: 3 }}>
            {userEmail ? (
                <View>
                    <Card className='mt-2 rounded-lg'>
                        <CardHeader>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <CardTitle className='font-semibold mt-4'>$ 55,460.09</CardTitle>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <CardTitle className='text-base text-green-500 font-semibold mt-4'>+ 379.81 %</CardTitle>
                            </View>
                            <CardContent>
                                <View className='flex-row justify-around gap-3 mt-8'>
                                    <View className='items-center'>
                                        <Text className='text-xl font-semibold'>$11,558.76</Text>
                                        <Text className='text-sm text-muted-foreground'>Cost</Text>
                                    </View>
                                    <View className='items-center'>
                                        <Text className='text-xl font-semibold'>$43,901.33</Text>
                                        <Text className='text-sm text-muted-foreground'>Profit</Text>
                                    </View>
                                </View>
                            </CardContent>
                        </CardHeader>
                    </Card>
                    <Card className='mt-6 rounded-lg'>
                        <CardContent>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} className='mt-6 rounded-lg'>
                                <View>
                                    <CardTitle>1.012523 Bitcoin</CardTitle>
                                    <CardDescription className='text-left text-muted-foreground'>$42,411.56 ($40,000.13)</CardDescription>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <CardTitle className='text-right text-green-500'>+ 883.70%</CardTitle>
                                    <CardDescription>ROI</CardDescription>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                    <Card className='mt-6 rounded-lg'>
                        <CardContent>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} className='mt-6'>
                                <View>
                                    <CardTitle>2.745 Ethereum</CardTitle>
                                    <CardDescription className='text-muted-foreground'>$7,321 ($2,421.13)</CardDescription>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <CardTitle className='text-right text-red-500'>+ 263.70%</CardTitle>
                                    <CardDescription>ROI</CardDescription>
                                </View>
                            </View>
                        </CardContent>
                    </Card>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <AntDesign name="pluscircle" size={48} color="grey" style={{ textAlign: 'center', marginTop: 24 }} />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle style={{ marginBottom: 6 }}>Add a Crypto to your Portfolio</AlertDialogTitle>
                                <Input
                                    placeholder='Amount'
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                />
                                <Text>Choose a Crypto to add to your assets</Text>
                                <Select
                                    defaultValue={{ value: 'btc', label: 'Bitcoin' }}
                                    onSelect={item => setSelectedCrypto(item.value)}
                                >
                                    <SelectTrigger style={{ width: 250 }}>
                                        <SelectValue
                                            style={{ color: 'gray', fontSize: 14 }}
                                            placeholder='Select a crypto'
                                        />
                                    </SelectTrigger>
                                    <SelectContent insets={contentInsets} style={{ width: 250 }}>
                                        <SelectGroup>
                                            <SelectItem label='Bitcoin' value='BTC'>
                                                Bitcoin
                                            </SelectItem>
                                            <SelectItem label='Ethereum' value='ETH'>
                                                Ethereum
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    <Text>Cancel</Text>
                                </AlertDialogCancel>
                                <AlertDialogAction onPress={handleAddCrypto}>
                                    <Text>Add</Text>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </View>
            ) : (
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
            )}
        </View>
    );
}
