    import React, { useState, useEffect } from 'react';
    import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';

    import { supabase } from '../supabase';


    const ChatApp = ({ dados, mensagens, onClose, loggedUserId }) => {
        const [messages, setMessages] = useState(mensagens);
        const [newMessage, setNewMessage] = useState('');

        const sendMessage = async (receiverId, content, sender_id) => {

            try {
                const { error } = await supabase
                    .from('messages')
                    .insert([
                        {
                            sender_id: sender_id,
                            receiver_id: receiverId,
                            content: content,
                        },
                    ]);
        
                if (error) {
                    console.error('Erro ao enviar mensagem:', error.message);
                } else {
                    console.log('Mensagem enviada!');
                }
            } catch (err) {
                console.error('Erro inesperado:', err);
            }
        };
        

        // Atualiza mensagens quando o prop `mensagens` muda
        useEffect(() => {
            setMessages(mensagens);
        }, [mensagens]);

        // Função para enviar mensagem
        const handleSendMessage = async () => {
            if (newMessage.trim() === '') return; // Verifica se a mensagem não está vazia
        
            // Envia a mensagem para o banco de dados
            await sendMessage(dados.id, newMessage, loggedUserId);
        
            // Agora, em vez de simplesmente atualizar o estado com 'mensagens', atualize com o estado anterior + a nova mensagem
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: Math.random().toString(), // Gera um id único para a nova mensagem
                    content: newMessage,
                    sender_id: loggedUserId,
                    receiver_id: dados.id,
                },
            ]);
        
            // Limpa o campo de entrada
            setNewMessage('');
        };
        
        

        // Renderiza uma mensagem individual
        const renderMessage = ({ item }) => {
            const isMyMessage = item.sender_id === loggedUserId; // Verifica se o remetente é o usuário logado

            return (
                <View
                    style={[
                        styles.messageContainer,
                        isMyMessage ? styles.myMessage : styles.otherMessage,
                    ]}
                >
                    <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
                        {item.content}
                    </Text>
                </View>
            );
        };

        return (
            <View style={styles.container}>
                {/* Cabeçalho do Chat */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="arrow-back-outline" size={20} color="#000" />
                    </TouchableOpacity>

                    <Image style={styles.imagemAluno} source={require('../assets/img/alunoFt.png')} />

                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.text}> {dados.nome} </Text>
                        <Text style={styles.subText}> {dados.telefone} </Text>
                    </View>
                </View>
                <View style={styles.linha}></View>

                {/* Lista de Mensagens */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    style={styles.messageList}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                {/* Campo de Entrada e Botão de Envio */}
                <View style={styles.inputContainer}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Digite uma mensagem..."
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                    >
                        <Ionicons name="arrow-up-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingTop: 20,
        },
        messageList: {
            flex: 1,
            marginHorizontal: 10,
        },
        messageContainer: {
            padding: 10,
            borderRadius: 20,
            marginVertical: 5,
            maxWidth: '70%',
        },
        myMessage: {
            backgroundColor: '#ECECEC',
            borderWidth: 1,
            borderRadius: 25,
            borderColor: '#ECECEC',
            alignSelf: 'flex-end',
        },
        otherMessage: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderRadius: 25,
            borderColor: '#ECECEC',
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
            borderColor: '#ECECEC',
        },
        sendButton: {
            marginLeft: 10,
            backgroundColor: '#FF3838',
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 10,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        imagemAluno: {
            marginLeft: 10,
            width: 45,
            height: 45,
        },
        text: {
            fontSize: 14,
            color: '#000',
        },
        subText: {
            fontSize: 12,
            color: '#727272',
        },
        linha: {
            marginVertical: 10,
            width: '100%',
            height: 0.7,
            borderWidth: 0.7,
            borderColor: '#ff0000',
        },
    });

    export default ChatApp;
