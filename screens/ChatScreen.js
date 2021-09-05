import React, { useLayoutEffect, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import { AntDesign, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { auth, db } from '../firebase';
import firebase from 'firebase/app';

export default function ChatScreen({ navigation, route }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id).collection('messages').add({
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setInput('');
    };
    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id)
            .collection('messages').orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            ));

        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Avatar rounded source={{
                        uri: messages[0]?.data.photoURL || "https://cdn5.vectorstock.com/i/1000x1000/62/59/default-avatar-photo-placeholder-profile-icon-vector-21666259.jpg"
                    }} />
                    <Text>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{
                        marginLeft: 10
                    }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name='arrowleft' size={24} color='white' ></AntDesign>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='videocamera' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('AddChat')}>
                        <AntDesign name='phone' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, messages])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback >
                <>
                        <ScrollView contentContainerStyle={{paddingTop: 15}} >
                            {messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                            size={30}
                                            rounded
                                            position='absolute'
                                            bottom={-15}
                                            right={-5}
                                            source={{ uri: data.photoURL }}
                                            containerStyle={{ position: 'absolute', bottom: -15, right: -5 }}
                                        />
                                        <Text style={styles.receiverText}> {data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            size={30}
                                            rounded
                                            position='absolute'
                                            bottom={-15}
                                            right={-5}
                                            source={{ uri: data.photoURL }}
                                            containerStyle={{ position: 'absolute', bottom: -15, right: -5 }}
                                        />
                                        <Text style={styles.senderName}> {data.displayName}</Text>
                                        <Text style={styles.senderText}> {data.message}</Text>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        <View style={styles.footer} >
                            <TextInput
                                placeholder='Signal message'
                                style={styles.textInput}
                                value={input}
                                onChangeText={(text) => { setInput(text)} }
                                onSubmitEditing={sendMessage}
                                autoFocus
                            />
                            <TouchableOpacity activeOpacity={0.5}
                                onPress={sendMessage}
                            >
                                <Ionicons name='send' size={24} color='#2B68E6' />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: 'transparent',
        backgroundColor: '#ECECEC',
        borderWidth: 1,
        padding: 10,
        color: 'grey',
        borderRadius: 30

    },
    receiver: {
        padding: 15,
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
        backgroundColor: '#ECECEC'
    },
    sender: {
        padding: 15,
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
        backgroundColor: '#2B68E6'
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    senderText: {
        marginLeft: 10,
        marginBottom: 15,
        fontWeight: '500',
        color: 'white'
    },
    receiverText: {
        marginLeft: 10,
        fontWeight: '500',
        color: 'black'
    }
})
