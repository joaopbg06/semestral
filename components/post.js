import React, { useState, useEffect } from 'react';
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
    Modal
} from 'react-native';

import { supabase } from '../supabase';


// Componente Post
const Post = ({ texto, imagens, imagem, tipo, opcoes, id, del, user_id }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const fetchUserProfile = async (userId) => {

        try {
            // Realiza a consulta na tabela "profiles" filtrando pelo "id" do usuário
            const { data, error } = await supabase
                .from('profiles') // Nome da tabela onde os dados do usuário estão
                .select('*') // Seleciona todas as colunas
                .eq('id', userId) // Filtra pela coluna 'id' com o valor de userId
                .single(); // Retorna apenas um registro (único)

            if (error) {
                console.error('Erro ao buscar perfil:', error.message);
                return null; // Retorna null em caso de erro
            }

            setUserProfile(data);


            // Retorna os dados do perfil encontrado
        } catch (err) {
            console.error('Erro inesperado ao buscar perfil:', err);
            return null; // Retorna null em caso de erro inesperado
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);  // Converte a string ISO para um objeto Date
        const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia e formata com dois dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês (getMonth começa em 0, então somamos 1) e formata
        const year = date.getFullYear();  // Obtém o ano

        return `${day}/${month}/${year}`;  // Retorna a data no formato dd/mm/yyyy
    };

    useEffect(() => {
        fetchUserProfile(user_id)
    }, [user_id])




    const openModal = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const handleDelete = () => {
        del(id); // Chama a função com o ID do post
    };

    if (userProfile === null) {
        return <Text>Carregando...</Text>;  // Exibe um carregando enquanto os dados não chegam
    }

    return (
        <View style={[styles.container]}>

            <View style={styles.header}>

                <View style={styles.box}>
                    <Image style={styles.img} source={require(`../assets/img/alunoFt.png`)} />

                    <Text style={styles.nome}> {userProfile.nome} </Text>
                    <Text style={styles.time}> {formatDate(userProfile.created_at)} </Text>
                </View>

                <Pressable onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={22} color={'#ff0000'} />
                </Pressable>
            </View>

            {tipo === 'cardapio' && imagem && (
                <View style={styles.cardapioConteiner}>
                    <Pressable onPress={() => openModal(imagem)}>
                        <Image source={{ uri: imagem }} style={styles.postImage} />
                    </Pressable>
                </View>
            )}


            {tipo === 'enquete' && (
                <View style={styles.enqueteConteiner}>
                    <Text style={styles.postText}>{texto}</Text>

                    <View style={styles.enqueteOptionsContainer}>
                        {opcoes?.map((opcao, index) => (
                            <View key={index} style={styles.enqueteOption}>
                                <Text style={styles.enqueteOptionText}>{opcao}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {tipo === 'sugestao' && (
                <View style={styles.sugestaoConteiner}>
                    <Text style={styles.postText}>{texto}</Text>

                    <View style={styles.imagesContainer}>
                        {imagens?.map((imageUri, index) => (
                            <Pressable key={index} onPress={() => openModal(imageUri)}>
                                <View style={styles.imageWrapper}>
                                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                                </View>
                            </Pressable>

                        ))}

                    </View>
                </View>
            )}


            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <Pressable style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="close" size={30} color="#fff" />
                    </Pressable>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
                    )}
                </View>
            </Modal>

        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        padding: 10,

    },
    postText: {
        fontSize: 16,
    },
    imagesContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: `space-between`
    },

    imageWrapper: {
        width: 70,
        height: 70,
        marginBottom: 10, // Espaçamento abaixo de cada imagem

    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    postImage: {
        width: `100%`,
        height: 200,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    enqueteOptionsContainer: {
        marginTop: 10,
    },
    enqueteOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    enqueteOptionText: {
        fontSize: 14,
        color: '#333',
    },
    img: {
        width: 40,
        height: 40
    },
    header: {
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
        marginHorizontal: 5,
    },
    box: {
        flexDirection: `row`,
        alignItems: `center`,
    },
    nome: {
        marginLeft: 5,
        fontSize: 14,
    },
    time: {
        marginLeft: 5,
        fontSize: 12,
        paddingTop: 1,
        color: `#474747`
    },
    sugestaoConteiner: {
        marginHorizontal: 10,
        marginTop: 10
    },
    enqueteConteiner: {
        marginHorizontal: 10,
        marginTop: 10
    },
    cardapioConteiner: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '90%',
        height: '70%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },


});

export default Post;
