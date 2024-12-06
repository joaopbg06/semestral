import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Pressable,
    FlatList,
    Modal,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import Adicionar from '../components/adicionar'
import LaudoAluno from '../components/laudo';
import ContatoPai from '../components/contatoPai';
import ChatApp from '../components/chat';
import Post from '../components/post';

import { supabase } from '../supabase';

import { useRoute } from '@react-navigation/native';
// Certifique-se de ter o Supabase configurado

const Contato = ({ data }) => {
    const [modalVisible, setModalVisible] = useState(false); // Controle do Modal
    const [selectedContato, setSelectedContato] = useState(null); // Armazenar o contato selecionado

    const { profile } = data;

    // Função para buscar o perfil do usuário
    


    // Exemplo de chamada para enviar dados ao pai
    


    // Exibe o carregamento enquanto os dados estão sendo carregados
    

    // Exibe as informações do perfil do aluno
    return (
        <Pressable
            onPress={() => {
                setSelectedContato(profile);  // Define o contato selecionado
                setModalVisible(true);  // Exibe o modal
            }}
            style={styles.conteiner}
        >
            <View style={{ flexDirection: 'row' }}>
                <Image style={styles.fotoAluno} source={require('../assets/img/alunoFt.png')} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.text}> {profile.nome} </Text>
                    <Text style={styles.subText}>{profile.email}</Text>
                    <Text style={styles.subText}>RM: {profile.rm}</Text>
                </View>
            </View>
            <Ionicons name={'chevron-forward-outline'} size={20} color={'#727272'} />

            {/* Modal para exibir os detalhes do contato */}
            <Modal
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}  // Fecha o modal ao pressionar o botão de voltar
            >
                <LaudoAluno
                    contato={selectedContato} // Passa os dados do contato selecionado para o componente do modal
                    onClose={() => setModalVisible(false)}  // Função para fechar o modal
                />
            </Modal>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    conteiner: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#ECECEC'
    },
    text: {
        fontSize: 12,
        color: '#000'
    },
    subText: {
        marginLeft: 2,
        fontSize: 10,
        color: '#727272'
    },
    fotoAluno: {
        width: 45,
        height: 45
    }
});

export default Contato;
