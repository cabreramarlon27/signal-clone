import React, { useLayoutEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { View, StyleSheet,  } from 'react-native';
import { Button, Input, Text } from "react-native-elements";
import { auth } from '../firebase';
const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || "https://cdn5.vectorstock.com/i/1000x1000/62/59/default-avatar-photo-placeholder-profile-icon-vector-21666259.jpg",
            })
        }).catch((error) => alert(error.message));
     };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Back to Login',
        })
    }, [navigation])
    
    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Text h3 style={{ marginBottom: 50 }}> Create a signal account </Text>
            <View style={styles.inputContainer}>
                <Input placeholder="Full name" autofocus type='text' value={name}
                    onChangeText={(text) => setName(text)} />
                <Input placeholder="Email" type='email' value={email}
                    onChangeText={(text) => setEmail(text)} />
                <Input placeholder="Password" type='password' value={password}
                    secureTextEntry onChangeText={(text) => setPassword(text)} />
                <Input placeholder="Profile Picture URL (optional)" type='email' value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)} onSubmitEditing={ register}/>
            </View>

            <Button
                title='Register'
                raised
                onPress={register}
                containerStyle={styles.button} />
            <View style={{height: 100}} />
            
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginTop: 10,
    }
});

