import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ChatApp = ({ contato, mensagens, onClose, onSendMessage }) => {
    // Simulação de mensagens em um array
    const [messages, setMessages] = useState(mensagens);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setMessages(mensagens);
    }, [mensagens]);

    // Usuário atual
    const currentUser = 'me';

    // Função para adicionar uma nova mensagem
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return; // Verifica se a mensagem não está vazia

        const newMsg = {
            id: Math.random().toString(), // Gera um ID único
            text: newMessage,
            sender: currentUser,
        };

        // Chama a função passada pelo pai para enviar a nova mensagem
        onSendMessage(contato.id, newMsg); // Passa o ID do contato e a nova mensagem
        setNewMessage(''); // Limpa o campo de entrada
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
            {/* Cabeçalho do chat com o nome do contato */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Chat com {contato?.nome}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de mensagens */}
            <FlatList
                data={messages.filter(msg => msg.text !== "")}
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
