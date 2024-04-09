import React, {useState, Component, useEffect } from 'react'
import { FlatList, Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { app,analytics } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getDocs,query ,getFirestore, collection, addDoc, orderBy } from 'firebase/firestore';
import Transactions from '../components/Transactions';

const HomeScreen=()=> {

    const db = getFirestore(app);
    const navigation=useNavigation()
    const auth=getAuth(app);
    const user=auth.currentUser;

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
      <Transactions/>
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1.5,
    justifyContent:'column',
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
  

})

export default HomeScreen;
