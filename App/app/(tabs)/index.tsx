import React, { useEffect, useState } from 'react';
import { View, Alert, Image, ScrollView, RefreshControl } from 'react-native';
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
    const navigation = useNavigation();
    const [selectedCrypto, setSelectedCrypto] = useState('BTC');
    const [inputValue, setInputValue] = useState("");
    const { token } = useToken();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [value, setValue] = useState('account');
    const [email, setEmail] = useState('');
    const userId = useFetchUserId();
    const [portfolioData, setPortfolioData] = useState([]);
    const [totalAssets, setTotalAssets] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (userId) {
            getTotalAssets();
            getUserPortfolio();
        }
    }, [userId]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getTotalAssets();
        getUserPortfolio();
        setTimeout(() => setRefreshing(false), 1000);
    }, [refreshing]);

    const getTotalAssets = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:5281/api/CryptoPortfolio/getTotalPortfolioValue/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTotalAssets(data);
            }
        } catch (error) {
            console.error('Errors:', error);
        }
    };

    const getUserPortfolio = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:5281/api/CryptoPortfolio/getUserPortfolio/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPortfolioData(data);
            }
        } catch (error) {
            console.error('Errors:', error);
        }
    };

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

    const cryptoIcons = {
        BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=031',
        ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=031',
        USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=031',
        BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=031',
        SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=031',
        USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=031',
        XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=031',
        DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=031',
        TON: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=031',
        ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=031',
    };
    const handleAddCrypto = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:5281/api/CryptoPortfolio/addCryptoToPortfolio/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: '0',
                    cryptoSymbol: selectedCrypto,
                    amount: inputValue,
                }),
            });
            console.log(response)
            if (response.ok) {
                getUserPortfolio();
                getTotalAssets();

                Alert.alert('Success', 'Crypto added to your portfolio.');
            } else {
                Alert.alert('Error', 'Failed to add crypto to your portfolios.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <ScrollView
            style={{ flex: 1, gap: 1, padding: 3 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >

            <View>
                <Card className='mt-2 rounded-lg'>
                    <CardHeader>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <CardTitle className='font-semibold mt-4'>$ {totalAssets ? totalAssets : '0.00'}</CardTitle>
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
                {portfolioData.map((item, index) => (
                    <Card className='mt-6 rounded-lg' key={index}>
                        <CardContent>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} className='mt-6 rounded-lg'>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: cryptoIcons[item.cryptoSymbol],
                                        }}
                                        style={{ width: 50, height: 50, marginRight: 10 }}
                                    />
                                    <View>
                                        <CardTitle>{item.amount} {item.cryptoSymbol}</CardTitle>
                                        <CardDescription className='text-left text-muted-foreground'>$42,411.56 ($40,000.13)</CardDescription>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <CardTitle className='text-right text-green-500'>+ 883.70%</CardTitle>
                                    <CardDescription>ROI</CardDescription>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                ))}

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
                            <Select defaultValue={{ value: selectedCrypto, label: 'Bitcoin' }} onValueChange={(value) => {
                                setSelectedCrypto(value?.value);
                            }}>
                                <SelectTrigger style={{ width: 250 }}>
                                    <SelectValue
                                        style={{ color: 'gray', fontSize: 14 }}
                                        placeholder='Select a crypto'
                                    />
                                </SelectTrigger>
                                <SelectContent  style={{ width: 250 }}>
                                    <SelectGroup>
                                        {Object.keys(cryptoIcons).map((key) => (
                                            <SelectItem key={key} label={key} value={key}>
                                                <img
                                                    src={cryptoIcons[key]}
                                                    alt={key}
                                                />
                                                {key}
                                            </SelectItem>
                                        ))}
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
        </ScrollView>
    );
}
