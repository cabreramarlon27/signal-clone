import React, {useState, useLayoutEffect} from 'react'
import { Input, Button, Icon } from 'react-native-elements'
import { StyleSheet, Text, View } from 'react-native'
import {db} from '../firebase'
const AddChat = ({ navigation }) => {
    const [input, setInput] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new chat',
            headerBacktTitle: 'Chats'
        });
        
    }, [navigation]);

    const createChat = async () => {
        await db.collection('chats')
            .add({ chatName: input })
            .then(() => {
                navigation.goBack()
            })
            .catch((error) => alert(error));
    };
    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter a chat name'
                value={input}
                onChangeText={(text) => setInput(text)}
                leftIcon={
                    <Icon name='wechat' type='antdesign' size={24} color='black' />
                }

                onSubmitEditing={createChat}
            />
            <Button onPress={createChat} title='Create a new chat' />
        </View>
    )
}

export default AddChat;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        height: '100%'
    },
});
