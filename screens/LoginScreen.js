import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';

const LoginScreen = ({ navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace('Home');
            }
        });
        return unsubscribe;
    },[])
    const signin = () => {
        auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error));
    };
    return (
        <KeyboardAvoidingView behavior='padding'  style={ styles.container}>
            <StatusBar style='light' />
            <Image
                source={{
                    uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
                }}
                style={{ width: 200, height: 200}}
            />
            <View style={styles.inputContainer}>
                <Input
                    placeholder="email"
                    type="Email"
                    value={email}
                    autoFocus
                    onChangeText={(text)=>setEmail(text)}
                />
                <Input
                    placeholder="password"
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={ signin }
                />
            </View>
            <Button containerStyle={styles.button} title='Login' onPress={ signin } />
            <Button containerStyle={styles.button} type='outline' title='Register' onPress={() => navigation.navigate('register')} />
            <View style={{height: 100}} />
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,

    },
});