import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { app } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getDocs, query, getFirestore, collection, addDoc, orderBy } from 'firebase/firestore';

const Transaction = () => {
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);

    const db = getFirestore(app);
    const navigation = useNavigation();
    const auth = getAuth(app);
    const user = auth.currentUser;

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const q = query(transactionsRef, orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                const transactionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTransactions(transactionsData);
            } catch (error) {
                console.error('Error fetching transactions: ', error);
            }
        };

        fetchTransactions();
    }, [transactions]);

    const handleAddTransaction = async () => {
        if (transactionType.trim() !== '' && amount.trim() !== '') {
            const transactionData = {
                type: transactionType,
                amount: parseFloat(amount),
                timestamp: new Date().toISOString(),
            };

            try {
                const docRef = await addDoc(transactionsRef, transactionData);
                console.log('Transaction added with ID: ', docRef.id);
            } catch (error) {
                console.error('Error adding transaction: ', error);
            }
        } else {
            console.log('Please fill out all fields');
        }
    };

    return (
        <ScrollView>
            <Text style={styles.heading}>Add Transactions</Text>
            <View style={styles.addTrans}>
                <Picker
                    style={styles.picker}
                    selectedValue={transactionType}
                    onValueChange={(itemValue) => setTransactionType(itemValue)}
                >
                    <Picker.Item label="Select Type" value="" />
                    <Picker.Item label="Credit" value="Credit" />
                    <Picker.Item label="Debit" value="Debit" />
                </Picker>
                <TextInput
                    style={styles.amt}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
                    <Text style={styles.buttonText}>Add Transaction</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Transactions</Text>
            <FlatList
                data={transactions}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellText}>Type</Text>
                            <Text>{item.type}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellText}>Amount</Text>
                            <Text>{item.amount}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.cellText}>Timestamp</Text>
                            <Text>{item.timestamp.split('T')[0]} {item.timestamp.split('T')[1].split('.')[0]}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    addTrans: {
        flexDirection: 'column'
    },
    tableRow: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingVertical: 10,
    },
    tableCell: {
        flex: 1,
        paddingHorizontal: 10,
    },
    cellText: {
        fontWeight: '700'
    },
    heading: {
        fontWeight: '700',
        fontSize: 30,
        margin: 20
    },
    picker: {
        margin: 20,
        padding: 20
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 60
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    amt: {
        marginBottom: 10,
        marginLeft: 90,
        fontWeight: '700', // Bolden the text
        fontSize: 16, // Adjust font size if needed
    }
});

export default Transaction;
