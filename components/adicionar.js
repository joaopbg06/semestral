import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Adicionar = ({ visible, onClose, onSubmit }) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('opcao1');

    const [items, setItems] = useState([
        { label: 'Opção 1', value: 'opcao1' },
        { label: 'Opção 2', value: 'opcao2' },
    ]);

    // Estado para armazenar até 4 imagens
    const [selectedImages, setSelectedImages] = useState([]);

    // Estado para armazenar as opções da enquete
    const [options, setOptions] = useState(['', '']); // Começa com duas opções
    const [numOptions, setNumOptions] = useState(2);  // Controla o número de opções

    const pickImageAsync = async () => {
        if (selectedImages.length >= 4) {
            alert('Você só pode adicionar até 4 imagens.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImageUri = result.assets[0].uri;
            console.log("Imagem selecionada URI:", newImageUri); // Verifica o URI da imagem selecionada
            setSelectedImages([...selectedImages, newImageUri]);
        } else {
            alert('Você não selecionou nenhuma imagem.');
        }
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };


    const incrementOptions = () => {
        if (numOptions < 10) {  // Limite de 10 opções
            setNumOptions(numOptions + 1);
            setOptions([...options, '']);  // Adiciona uma nova opção vazia
        }
    };

    const decrementOptions = () => {
        if (numOptions > 2) {  // Mínimo de 2 opções
            setNumOptions(numOptions - 1);
            setOptions(options.slice(0, -1));  // Remove a última opção
        }
    };

    const [texto, setTexto] = useState('');


    const handleEnviar = () => {
        const novoPost = {
            texto,
            imagens: selectedImages,
        };
        console.log("Novo post criado:", novoPost); // Verifica o conteúdo do post antes de enviar
        onSubmit(novoPost);
        setTexto('');
        setSelectedImages([]);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Pressable onPress={onClose}>
                            <Ionicons name={'close-circle-outline'} size={40} color={'#ff0000'} />
                        </Pressable>
                        <View style={styles.linha}></View>
                    </View>

                    <View style={styles.form}>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="Selecione uma opção"
                            style={styles.pickerContainer}
                            dropDownContainerStyle={styles.dropdownContainer}
                            itemSeparator={true}
                            itemSeparatorStyle={styles.separator}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                        />

                        {value === 'opcao1' ? (
                            <>
                                <View style={styles.textAreaContainer}>
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder="Digite algo mais..."
                                        placeholderTextColor="#999"
                                        multiline={true}
                                        numberOfLines={6}
                                        value={texto}
                                        onChangeText={setTexto}
                                    />
                                    <Pressable onPress={pickImageAsync} style={styles.attachButton}>
                                        <Feather name="paperclip" size={20} color="#727272" />
                                    </Pressable>
                                </View>

                                <View style={styles.imagePreviewContainer}>
                                    {selectedImages.map((imageUri, index) => (
                                        <View key={index} style={styles.imageWrapper}>
                                            <Image
                                                source={{ uri: imageUri }}
                                                style={styles.previewImage}
                                            />
                                            <Pressable
                                                onPress={() => removeImage(index)}
                                                style={styles.deleteButton}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#ff3838" />
                                            </Pressable>
                                        </View>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <View style={styles.otherOptionContainer}>
                                <TextInput
                                    style={styles.titulo}
                                    placeholder="Digite o título..."
                                />

                                <View style={styles.numInputContainer}>
                                    <Pressable onPress={decrementOptions} style={styles.arrowButton}>
                                        <Ionicons name="remove-circle-outline" size={24} color="#727272" />
                                    </Pressable>
                                    <TextInput
                                        style={styles.numInput}
                                        value={String(numOptions)}  // Exibe o número de opções
                                        keyboardType="numeric"
                                        editable={false}  // Desabilita edição direta
                                    />
                                    <Pressable onPress={incrementOptions} style={styles.arrowButton}>
                                        <Ionicons name="add-circle-outline" size={24} color="#727272" />
                                    </Pressable>
                                </View>

                                <ScrollView
                                    style={styles.enquete}
                                    contentContainerStyle={styles.enqueteContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {options.map((option, index) => (
                                        <View key={index} style={styles.option}>
                                            <MaterialIcons name={"radio-button-off"} size={24} color={"#E6E6E6"} />
                                            <TextInput
                                                style={styles.textOption}
                                                placeholder="Digite aqui..."
                                                value={option}
                                                onChangeText={(text) => updateOption(index, text)}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <Pressable onPress={handleEnviar} style={styles.botaoEntrar}>
                        <Text style={styles.textoBotao}>Enviar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },

    enquete: {
        width: '100%',
        maxHeight: 150, // Altura máxima do ScrollView
        marginVertical: 20,
    },
    enqueteContent: {
        paddingBottom: 10, // Para dar espaço abaixo do último item
    },
    option: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    textOption: {
        borderBottomWidth: 1,
        borderColor: '#727272',
        width: '90%',
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // fundo escurecido
    },
    modalContent: {
        height: 'auto',
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    linha: {
        width: '70%',
        height: 2,
        backgroundColor: '#ff3838',
        opacity: 0.18,
        marginVertical: 15,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    form: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    pickerContainer: {
        borderWidth: 0, // Mantido conforme solicitado  
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
    },
    titulo: {
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#ffffff', // Cor de fundo do dropdown
        borderRadius: 10,
    },
    separator: {
        backgroundColor: '#ccc', // Cor do separador entre os itens
        height: 1,
    },
    selectedItemContainer: {
        backgroundColor: '#e0e0e0', // Cor de fundo para o item selecionado
    },
    selectedItemLabel: {
        fontWeight: 'bold', // Estilo do texto para o item selecionado
    },
    textAreaContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    textArea: {
        flex: 1,
        width: '100%',
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        textAlignVertical: 'top', // Alinha o texto no topo do TextArea
        minHeight: 200,
    },
    attachButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Permite que as imagens fiquem em várias linhas, se necessário
        justifyContent: 'space-between', // Espaçamento entre as imagens
        width: '100%',
        marginTop: 10,
    },
    imageWrapper: {
        width: 60,
        height: 60,
        marginBottom: 10, // Espaçamento abaixo de cada imagem
        position: 'relative', // Para posicionar o botão de deletar
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    deleteButton: {
        position: 'absolute',
        top: -10, // Ajusta a posição do botão de deletar
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
        elevation: 5, // Adiciona sombra para destacar o botão
    },
    botaoEntrar: {
        backgroundColor: '#ff3838',
        width: 100,
        height: 30,
        marginVertical: 10,
        borderRadius: 8,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 15,
    },
    otherOptionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    otherOptionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    numInput: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    numInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    numInput: {
        width: 50,
        height: 40,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 10,
        fontSize: 18,
    },
    arrowButton: {
        padding: 5,
    },
});

export default Adicionar;
