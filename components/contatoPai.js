import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { supabase } from '../supabase';

import ChatApp from './chat';

const ContatoPai = ({ data, ida }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const [receiverId, setReceiverId] = useState();
    const [senderId, setSenderId] = useState();
    const [messages, setMessages] = useState([]);
    const [dados, setDados] = useState({ id: '', nome: '', telefone: '' })
    const [modalVisible, setModalVisible] = useState(false); // Estado do modal

    // Função para buscar a última mensagem
    const fetchLastMessage = async (senderId, receiverId) => {
        try {
            // Buscando as mensagens entre senderId e receiverId
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
                .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
                .order('created_at', { ascending: false }) // Ordenando pela data mais recente
                .limit(1); // Pegando apenas a última mensagem

            if (error) {
                console.error('Erro ao buscar a última mensagem:', error.message);
                return null;
            }

            // Retorna a última mensagem, se houver
            return data.length > 0 ? data[0] : null;
        } catch (err) {
            console.error('Erro inesperado:', err);
            return null;
        }
    };


    // Função para buscar todas as mensagens entre dois usuários
    const fetchMessages = async (loggedUserId, otherUserId) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${loggedUserId},receiver_id.eq.${loggedUserId}`)
                .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Erro ao buscar mensagens:', error.message);
                return [];
            }

            return data.filter(message =>
                (message.sender_id === loggedUserId && message.receiver_id === otherUserId) ||
                (message.sender_id === otherUserId && message.receiver_id === loggedUserId)
            );
        } catch (err) {
            console.error('Erro inesperado:', err);
            return [];
        }
    };


    const fetchUserDetails = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, nome, telefone') // Seleciona apenas as colunas 'nome' e 'telefone'
                .eq('id', userId) // Filtra pelo ID do usuário

            if (error) {
                console.error('Erro ao buscar os detalhes do usuário:', error.message);
                return null;
            }

            if (data.length > 0) {
                return data[0]; // Retorna o objeto com 'nome' e 'telefone'
            } else {
                console.warn('Usuário não encontrado.');
                return null;
            }
        } catch (err) {
            console.error('Erro inesperado:', err);
            return null;
        }
    };


    // Carregar o receiverId e senderId
    useEffect(() => {
        setReceiverId(data.id);
        setSenderId(ida);
    }, [data.id, ida]);

    // Carregar a última mensagem
    useEffect(() => {
        const loadLastMessage = async () => {
            if (senderId && receiverId) {
                const message = await fetchLastMessage(senderId, receiverId);
                setLastMessage(message);
            }
        };

        loadLastMessage();

        console.log('carregou')
    }, [senderId, receiverId]);

    // Carregar todas as mensagens quando o modal for aberto
    const handleOpenModal = async () => {
        const chatMessages = await fetchMessages(senderId, receiverId);
        const dataOtherUser = await fetchUserDetails(receiverId)
        setDados(dataOtherUser)
        setMessages(chatMessages);
        setModalVisible(true); // Abre o modal
    };

    const handleUpdateMessage = (message) => {
        setLastMessage(message);

    };

    return (
        <View>
            {/* Botão para abrir o modal */}
            <Pressable onPress={handleOpenModal} style={styles.conteiner}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={styles.fotoAluno} source={require('../assets/img/alunoFt.png')} />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.text}> {data.nome} </Text>
                        <Text style={styles.subText}>
                            {lastMessage ? lastMessage.content : 'Ainda não conversaram'}
                        </Text>
                    </View>
                </View>
            </Pressable>

            <View style={styles.linha}></View>

            {/* Modal para o chat */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)} // Fechar ao pressionar "voltar"
            >
                <ChatApp
                    mensagens={messages} // Passa as mensagens para o ChatApp
                    onClose={() => setModalVisible(false)} // Função para fechar o modal
                    dados={dados}
                    loggedUserId={ida}
                    fetchLastMessage={fetchLastMessage} // Passando a função fetchLastMessage para o ChatApp
                    handleUpdateMessage={handleUpdateMessage}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    conteiner: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 45,
        paddingHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 20,
    },
    linha: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255, 0, 0, 0.18)',
    },
    text: {
        fontSize: 12,
        color: '#000',
    },
    subText: {
        marginLeft: 2,
        fontSize: 10,
        color: '#727272',
    },
    fotoAluno: {
        width: 40,
        height: 40,
    },
});

export default ContatoPai;
