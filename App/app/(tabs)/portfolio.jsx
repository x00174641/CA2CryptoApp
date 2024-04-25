import React, { useEffect, useState } from 'react';
import { View, Alert, Image, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
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
import { router } from 'expo-router';
import useFetchUserId from '~/components/hooks/FetchUserId';
import i18next, { languageResources } from '../services/i18next';
import { useTranslation } from 'react-i18next';
import languagesList from '../services/languageList.json';

export default function Screen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
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
    const [totalCost, setTotalCost] = useState(0); // Total cost state
    const [refreshing, setRefreshing] = useState(false);
    const [cryptoPrices, setCryptoPrices] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (userId) {
            setLoading(true);
            getTotalAssets();
            getUserPortfolio();
            getTransactionHistory();
        }
    }, [userId]);

    useEffect(() => {
        if (Object.keys(cryptoPrices).length > 0) {
            setPortfolioDataWithPrices();
        }
    }, [cryptoPrices]);

    const setPortfolioDataWithPrices = () => {
        setPortfolioData(portfolioData.map(item => {
            const totalValue = cryptoPrices[item.cryptoSymbol] ? (cryptoPrices[item.cryptoSymbol] * item.amount).toFixed(2) : '0.00';
            const roi = calculateROI(item.cryptoSymbol, totalValue);
            return { ...item, totalValue, roi };
        }));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getTotalAssets();
        getUserPortfolio();
        getTransactionHistory();
        setTimeout(() => setRefreshing(false), 1000);
    }, [refreshing]);

    const getTotalAssets = async () => {
        try {
            const response = await fetch(`http://159.65.21.195/api/CryptoPortfolio/getTotalPortfolioValue/${userId}`, {
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
        } finally {
            setLoading(false);
        }
    };

    const getUserPortfolio = async () => {
        try {
            const response = await fetch(`http://159.65.21.195/api/CryptoPortfolio/getUserPortfolio/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPortfolioData(data);
                if (data.length > 0) { // Check if portfolioData is not empty
                    fetchAllPrices(); // Fetch crypto prices
                }
            }
        } catch (error) {
            console.error('Errors:', error);
        }
    };

    const getTransactionHistory = async () => { // Function to fetch transaction history
        try {
            const response = await fetch(`http://159.65.21.195/api/CryptoTransaction/getTransactionsByUserId/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTransactionHistory(data);
                const total = data.reduce((acc, transaction) => {
                    return acc + (transaction.amount * transaction.price);
                }, 0);
                setTotalCost(total);
            }
        } catch (error) {
            console.error('Errors:', error);
        }
    };

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
            const response = await fetch(`http://159.65.21.195/api/CryptoPortfolio/addCryptoToPortfolio/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    portfolioID: 0,
                    id: '0',
                    cryptoSymbol: selectedCrypto,
                    amount: inputValue,
                }),
            });
            console.log(response.body)
            if (response.ok) {
                getUserPortfolio();
                getTotalAssets();
                getTransactionHistory();
                Alert.alert(t('add_crypto_success_title'), t('add_crypto_success_message'));
            } else {
                Alert.alert(t('add_crypto_error_title'), t('add_crypto_error_message'));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteCrypto = async (cryptoSymbol) => {
        try {
            const response = await fetch(`http://159.65.21.195/api/CryptoPortfolio/deleteCryptoFromPortfolio/${userId}/${cryptoSymbol}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                getUserPortfolio();
                getTotalAssets();
                getTransactionHistory();
                Alert.alert(t('delete_crypto_success_title'), t('delete_crypto_success_message'));
            } else {
                Alert.alert(t('delete_crypto_error_title'), t('delete_crypto_error_message'));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAllPrices = async () => {
        try {
            await Promise.all(
                portfolioData.map(item => fetchPrice(item.cryptoSymbol))
            );
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    };

    const fetchPrice = async (cryptoSymbol) => {
        try {
            const response = await fetch(`http://159.65.21.195/api/CryptoTransaction/getCryptoPrice/${cryptoSymbol}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Crypto Prices:", data);
                setCryptoPrices(prevPrices => ({ ...prevPrices, [cryptoSymbol]: data }));
            }
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    };
    
    const getEntryPrice = (cryptoSymbol) => {
        const transactions = transactionHistory.filter(transaction => transaction.cryptoSymbol === cryptoSymbol);
        if (transactions.length > 0) {
            const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
            const totalPrice = transactions.reduce((acc, transaction) => acc + (transaction.amount * transaction.price), 0);
            return totalPrice / totalAmount;
        }
        return 0;
    };

    const calculateROI = (cryptoSymbol, totalValue) => {
        const cryptoPrice = transactionHistory.find(transaction => transaction.cryptoSymbol === cryptoSymbol)?.price;
        if (cryptoPrice) {
            const entryPrice = cryptoPrice * portfolioData.find(item => item.cryptoSymbol === cryptoSymbol)?.amount;
            if (entryPrice !== undefined && entryPrice !== null && entryPrice !== 0) {
                const profitLoss = ((totalValue - entryPrice) / entryPrice) * 100;
                return profitLoss.toFixed(2);
            }
        }
        return 0;
    };

    const profitLossPercentage = totalAssets !== null && totalCost !== null ?
    (((totalAssets - totalCost) / totalCost) * 100).toFixed(2) :
    0;

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            router.replace('/');
        } catch (error) {
            console.log('Error clearing token: ', error);
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
            <Card className='w-full max-w-sm p-6 rounded-2xl'>
                    <CardHeader className='items-center'>
                        <View className='p-3' />
                        <CardTitle className='pb-2 text-center'>$ {totalAssets ? totalAssets.toLocaleString() : '0.00'}</CardTitle>
                        <View className='flex-row'>
                            <CardDescription className='text-base font-semibold' style={{ color: (profitLossPercentage) < 0 ? 'red' : 'green' }}>{profitLossPercentage} %</CardDescription>
                        </View>
                    </CardHeader>
                    <CardContent>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>${totalCost.toLocaleString()}</Text>
                            <Text style={{ fontSize: 12, color: '#8E8E93' }}>{t('cost')}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: totalAssets - totalCost < 0 ? 'red' : 'green' }}>
                                {(totalAssets - totalCost).toFixed(2)}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#8E8E93' }}>{t('pnl')}</Text>
                        </View>
                    </View>
                    </CardContent>

                </Card>
              
                {cryptoPrices && portfolioData.map((item, index) => (
                    <Card className='mt-6 rounded-lg' style={{marginTop: 15, padding: 10}} key={index}>
                        <CardContent>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={{
                                            uri: cryptoIcons[item.cryptoSymbol],
                                        }}
                                        style={{ width: 50, height: 50, marginRight: 10 }}
                                    />
                                    <View>
                                        <CardTitle>{item.amount} {item.cryptoSymbol}</CardTitle>
                                        <CardDescription className='text-left text-muted-foreground'>
                                            {`$${item.totalValue}`}
                                        </CardDescription>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <CardTitle  style={{color: item.roi < 0 ? 'red' : 'green'}}>
                                            {item.roi}%
                                        </CardTitle>
                                        <CardDescription>{t('pnl_percentage')}</CardDescription>
                                    </View>
                                    <View style={{ marginLeft: 'auto' }}>
                                        <AntDesign 
                                            name="closecircleo" 
                                            size={24} 
                                            color="red" 
                                            onPress={() => handleDeleteCrypto(item.cryptoSymbol)} 
                                            style={{ marginLeft: 'auto', padding: 10 }} 
                                        />
                                    </View>
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
                            <AlertDialogTitle style={{ marginBottom: 12 }}>{t('add_crypto')}</AlertDialogTitle>
                            <Text>{t('choose_crypto')}</Text>
                            <Select defaultValue={{ value: selectedCrypto, label: 'Bitcoin' }} onValueChange={(value) => {
                                setSelectedCrypto(value?.value);
                            }}>
                                <SelectTrigger style={{ width: 250 }}>
                                    <SelectValue
                                        style={{ color: 'gray', fontSize: 14 }}
                                        placeholder={t('select_crypto')}
                                    />
                                </SelectTrigger>
                                <SelectContent style={{ width: 250 }}>
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
                            <Text>{t('enter_amount')}</Text>
                            <Input
                                placeholder={t('enter_amount')}
                                value={inputValue}
                                onChangeText={setInputValue}
                            />
                        
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                <Text>{t('cancel')}</Text>
                            </AlertDialogCancel>
                            <AlertDialogAction onPress={handleAddCrypto}>
                                <Text>{t('add')}</Text>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </View>
            <Button style={{backgroundColor: "#121212", marginTop: 100}} title="Logout" onPress={handleLogout}>
                <Text style={{color: "white"}}>Logout</Text>
            </Button>
        </ScrollView>
    );
}
