import React, {useState, Component, useEffect } from 'react'
import { FlatList, Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { app,analytics } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getDocs,query ,getFirestore, collection, addDoc, orderBy } from 'firebase/firestore';
import Transactions from '../components/Transactions';
import Transaction from '../components/Transactions';

const AnalysisScreen=()=> {

    let transactionData;
    const db = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    const navigation=useNavigation();
    let types=[];
    const transactionsRef = collection(db, 'users', user.uid, 'transactions');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const q = query(transactionsRef);
                const querySnapshot = await getDocs(q);
                transactionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // console.log(transactionsData);
                transactionsData.forEach((element) => {
                    if(element["category"]!==null)types.push(element["category"])
                  });
                console.log(types)
            
            } catch (error) {
                console.error('Error fetching transactions: ', error);
            }
        };
        fetchTransactions();
      }, []);
      
    


  return(
    <View style={styles.container}>
      <Text></Text>
    </View>
  )
  
}


const styles = StyleSheet.create({
  

})

export default AnalysisScreen;
