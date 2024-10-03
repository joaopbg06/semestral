import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Adicionar = ({ visible, onClose }) => {
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

    const pickImageAsync = async () => {
        // Limita a quantidade de imagens para 4
        if (selectedImages.length >= 4) {
            alert('Você só pode adicionar até 4 imagens.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, result.assets[0].uri]);
        } else {
            alert('Você não selecionou nenhuma imagem.');
        }
    };

    // Função para remover uma imagem pelo índice
    const removeImage = (indexToRemove) => {
        setSelectedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    // Função para adicionar uma nova opção
    const addOption = () => {
        if (options.length < 10) { // Limita a 10 opções
            setOptions((prevOptions) => [...prevOptions, '']);
        }
    };

    // Função para atualizar uma opção específica
    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeLastOption = () => {
        if (options.length > 2) { // Mantém pelo menos duas opções
            setOptions((prevOptions) => prevOptions.slice(0, -1));
        } else {
            alert('Você deve ter pelo menos duas opções.');
        }
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

                        {/* Renderiza a interface com base na opção selecionada */}
                        {value === 'opcao1' ? (
                            <>
                                <View style={styles.textAreaContainer}>
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder="Digite algo mais..."
                                        placeholderTextColor="#999"
                                        multiline={true}
                                        numberOfLines={6}
                                    />
                                    <Pressable onPress={pickImageAsync} style={styles.attachButton}>
                                        <Feather name="paperclip" size={20} color="#727272" />
                                    </Pressable>
                                </View>

                                {/* Exibe as imagens selecionadas */}
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
                            // Interface alternativa para outras opções
                            <View style={styles.otherOptionContainer}>
                                <TextInput
                                    style={styles.titulo}
                                    placeholder="Digite o título..."
                                />

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

                                {/* Botão para adicionar nova opção */}
                                <View style={styles.buttonContainer}>
                                    
                                    
                                </View>
                            </View>
                        )}
                    </View>

                    <Pressable onPress={onClose} style={styles.botaoEntrar}>
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
    removeOptionButton: {
        marginTop: 10,
        backgroundColor: '#ff3838',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5, // Para dar espaço entre os botões
    },
    removeOptionText: {
        color: '#fff',
        fontSize: 15,
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
    addOptionButton: {
        marginTop: 10,
        backgroundColor: '#ff3838',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addOptionText: {
        color: '#fff',
        fontSize: 15,
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
        height: 'auto',
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
});

export default Adicionar;
