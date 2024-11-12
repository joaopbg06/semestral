import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Componente Post
const Post = ({ texto, imagens }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.postText}>{texto}</Text>
            <View style={styles.imagesContainer}>
                {imagens.map((imageUri, index) => (
                    <Image key={index} source={{ uri: imageUri }} style={styles.postImage} />
                ))}
            </View>
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
        // Adicione outros estilos aqui
    },
    postText: {
        fontSize: 16,
        color: '#333',
        // Adicione outros estilos de texto aqui
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        // Adicione outros estilos para o container de imagens aqui
    },
    postImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
        // Adicione outros estilos para a imagem aqui
    },
});

export default Post;
