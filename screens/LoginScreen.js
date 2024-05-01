import React,{useState, Component, useEffect } from 'react'
import { KeyboardAvoidingView, Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { app,analytics } from '../firebase';
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const LoginScreen=()=> {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigation=useNavigation();
    const auth=getAuth(app);
    
    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged((user)=>{
            if(user){
                navigation.navigate("Home")
            }
        })
        return unsubscribe;
    },[]);

    const handleSignUp=()=>{
        
        createUserWithEmailAndPassword(auth,email,password)
        .then(userCredentials=>{
            const user=userCredentials.user;
            console.log('user created')
            console.log(user.email);
            navigation.navigate("Home");
        })
        .catch(err=>alert(err.message))
    }

    const handleLogin=()=>{
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('signed in')
            console.log(user.email);
            navigation.navigate("Home");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
        
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.inputContainer}>
            <TextInput placeholder='email' 
                value={email} 
                onChangeText={text=>setEmail(text)} 
                style={styles.input}> 
            </TextInput>

            <TextInput placeholder='password' 
                value={password} 
                onChangeText={text=>setPassword(text)} 
                style={styles.input} secureTextEntry> 
            </TextInput>

        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button,styles.buttonOutline]} onPress={handleSignUp}>
                <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    )
  }

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    inputContainer:{
        width:'80%',
    
    },
    input:{
        backgroundColor:'white',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5
    },
    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40
    },
    button:{
        backgroundColor:'#0782f9',
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems:'center'
    },
    buttonOutline:{
        backgroundColor:'white',
        marginTop:5,
        borderColor:'#0782f9',
        borderWidth:2
    },
    buttonText:{
        color:'white',
        fontWeight:'700',
        fontSize:16
    },
    buttonOutlineText:{

        color:'#0782f9',
        fontWeight:'700',
        fontSize:16
    }
})
