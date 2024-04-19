import React, {useState, Component, useEffect } from 'react'
import { FlatList, Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { app,analytics } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getDocs,query ,getFirestore, collection, addDoc, orderBy } from 'firebase/firestore';
import Transactions from '../components/Transactions';
import { classifier } from '../classifier';

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
                let arr={"online shopping":0, "rent and utilities":0, "luxuries":0,"subscriptions":0,"food and drinks":0,"miscellaneous":0}
                const promises = transactionsData.map(async (element) => {
                  if (element["category"] !== null) {
                    const response = await classifier({
                      inputs: element["category"],
                      parameters: {
                        candidate_labels: ["online shopping", "rent and utilities", "luxuries", "subscriptions", "food and drinks", "miscellaneous"]
                      }
                    });
                    console.log(`${response["labels"][0]} for ${response["sequence"]}`);
                    arr[response["labels"][0]]++; // Increment the corresponding category count in arr
                  }
                });
                
                
                  Promise.all(promises)
  .then(() => {
    console.log(arr); // Output the updated arr object
  })
  .catch((error) => {
    console.error("Error:", error);
  });

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
