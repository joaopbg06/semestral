import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatApp = () => {
    // Simulação de mensagens em um array
    const [messages, setMessages] = useState([
        { id: '1', text: 'Olá! Como você está?', sender: 'outro' },
        { id: '2', text: 'Oi! Estou bem, e você?', sender: 'me' },
        { id: '3', text: 'Estou ótimo, obrigado por perguntar!', sender: 'outro' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    // Usuário atual
    const currentUser = 'me';

    // Função para adicionar uma nova mensagem
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: Math.random().toString(),
            text: newMessage,
            sender: currentUser,
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    // Função para renderizar cada item da lista de mensagens
    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === currentUser;
        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Lista de mensagens */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                style={styles.messageList}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Campo de texto e botão de envio */}
            <View style={styles.inputContainer}>
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Digite uma mensagem..."
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    messageList: {
        flex: 1,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '70%',
    },
    myMessage: {
        backgroundColor: '#d1ffd1',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
    },
    myMessageText: {
        color: '#000',
    },
    otherMessageText: {
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#4caf50',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatApp;
