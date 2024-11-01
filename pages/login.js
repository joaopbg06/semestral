import { StatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Pressable,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export default function Bem_Vindo() {

    const navigation = useNavigation();

    const [isChecked, setIsChecked] = useState(false);
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const toggleCheck = () => {
        setIsChecked(prevState => !prevState);
    };

    const entrar = () => {
        if (!login) {
            alert('Informe o login');
        }
        else if (login === 'aluno') {
            navigation.navigate('senha', {
                usuario: 'home',
            });
        }
        else if (login === 'nutricionista') {
            navigation.navigate('senha', {
                usuario: 'nutricionista',
            });
        }
        else if (login === 'pais') {
            navigation.navigate('senha', {
                usuario: 'pais',
            });
        }
        else if (login === 'funcionarios') {
            navigation.navigate('senha', {
                usuario: 'funcionarios',
            });

        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.box}>
                        <View style={styles.logo}>
                            <Image
                                style={styles.imagemLogo}
                                source={require('../assets/img/logo.png')}
                            />
                            <View style={styles.linha}></View>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputLogin}>
                                <Text style={styles.label}>Login: </Text>
                                <TextInput
                                    placeholder='Digite aqui ...'
                                    style={styles.input}
                                    value={login}
                                    onChangeText={setLogin}
                                />
                            </View>

                            <View style={styles.inputSenha}>
                                <Text style={styles.label}>Senha: </Text>
                                <TextInput
                                    placeholder='Digite aqui ...'
                                    style={styles.input}
                                    secureTextEntry
                                    value={senha}
                                    onChangeText={setSenha}
                                />
                            </View>

                            <Pressable style={styles.manterLogin} onPress={toggleCheck}>
                                <MaterialIcons
                                    name={isChecked ? "radio-button-on" : "radio-button-off"}
                                    size={24}
                                    color={isChecked ? "#0D11F0" : "#E6E6E6"}
                                />
                                <Text style={styles.butaoManter}>Manter Login</Text>
                            </Pressable>
                        </View>

                        <View style={styles.botao}>
                            <Pressable onPress={entrar} style={styles.botaoEntrar}>
                                <Text style={styles.textoBotao}>Entrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff3838',
        justifyContent: 'flex-end',
    },
    scrollViewContent: {
        flexGrow: 1,
        width: '100%',
        justifyContent: 'flex-end',  // Para alinhar os elementos no final da tela
    },
    box: {
        paddingVertical: 20,
        width: '100%',
        flex: 0.5,
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    logo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    linha: {
        marginTop: 6,
        width: 250,
        height: 2,
        backgroundColor: '#ff3838'
    },
    form: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        backgroundColor: '#F5F5F5',
        width: 280,
        height: 30,
        borderRadius: 3,
        elevation: 2,
        paddingHorizontal: 5,
        marginTop: 10,
    },
    label: {
        fontSize: 14
    },
    manterLogin: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    butaoManter: {
        width: 260,
        fontSize: 14,
        color: '#0D11F0',
        marginLeft: 10,
        textDecorationLine: 'underline'
    },
    botao: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botaoEntrar: {
        backgroundColor: '#ff3838',
        width: 100,
        height: 30,
        borderRadius: 8,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoBotao: {
        color: '#fff',
        fontSize: 15,
    }
});

