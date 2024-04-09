import React, {useState, Component, useEffect } from 'react'
import { FlatList, Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { app,analytics } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getDocs,query ,getFirestore, collection, addDoc, orderBy } from 'firebase/firestore';

const HomeScreen=()=> {

  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  const db = getFirestore(app);
  const colref=collection(db,'transactions');
  const navigation=useNavigation()
  const auth=getAuth(app);
  const user=auth.currentUser;

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

  const handleSignOut=()=>{
    auth.signOut().then(()=>{
      navigation.replace("Login");
    })
    .catch(err=>alert(err.message))
  }

  return(
    <View style={styles.container}>
      <Text>Email : {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Add Transactions</Text>
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
    </View>
  )
}


const styles = StyleSheet.create({
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
  cellText:{
    fontWeight:'700'
  },  
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    backgroundColor:'#0782F9',
    width:'60%',
    padding:15,
    borderRadius:10,
    alignItems:'center',
    marginTop:20
  },
  buttonText:{
    color:'white',
    fontWeight:'700',
    fontSize:16
  },
  heading:{
    fontWeight:'700',
    fontSize:30,
    margin:20
  },
  picker:{
    margin:20,
    padding:20
  },
  amt:{

  }
})

export default HomeScreen;
