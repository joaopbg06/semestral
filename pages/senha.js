import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Pressable,
    ProgressBarAndroid // Barra de progresso nativa do Android
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Bem_Vindo() {
    const navigation = useNavigation();

    const [isChecked, setIsChecked] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const toggleCheck = () => {
        setIsChecked(prevState => !prevState);
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;

        // Critérios para aumentar a força da senha
        if (/[A-Z]/.test(password)) strength++; // Letra maiúscula
        if (/[a-z]/.test(password)) strength++; // Letra minúscula
        if (/\d/.test(password)) strength++;    // Números
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // Símbolos
        if (password.length >= 8) strength++;   // 8 ou mais caracteres

        setPasswordStrength(strength);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <Image style={styles.imagemLogo} source={require('../assets/img/logo.png')} />
                <View style={styles.linha}></View>
            </View>

            <View style={styles.form}>
                <View style={styles.inputs}>
                    {/* Campo de nova senha com ícone de olho */}
                    <View style={styles.inputLogin}>
                        <Text style={styles.label}>Nova senha:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder='Digite aqui ...'
                                style={styles.input}
                                secureTextEntry={!passwordVisible}  // Alterna entre mostrar/ocultar senha
                                onChangeText={(text) => {
                                    setPassword(text);
                                    checkPasswordStrength(text);
                                }}
                                value={password}
                            />
                            <Ionicons
                                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                                size={24}
                                color="black"
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                style={styles.eyeIcon}
                            />
                        </View>
                    </View>

                    {/* Barra de força da senha */}
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={passwordStrength / 5}  // Força vai de 0 a 5
                        color={passwordStrength < 3 ? "red" : passwordStrength < 4 ? "orange" : "green"} // Cor varia conforme a força
                    />

                    {/* Campo de confirmar senha com ícone de olho */}
                    <View style={styles.inputSenha}>
                        <Text style={styles.label}>Confirme a senha:</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder='Digite aqui ...'
                                style={styles.input}
                                secureTextEntry={!confirmPasswordVisible}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <Ionicons
                                name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                                size={24}
                                color="black"
                                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                style={styles.eyeIcon}
                            />
                        </View>
                    </View>
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
                <Pressable onPress={() => navigation.navigate('index')} style={styles.botaoEntrar}>
                    <Text style={styles.textoBotao}>Entrar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    logo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linha: {
        marginTop: 6,
        width: 250,
        height: 2,
        backgroundColor: '#ff3838',
    },
    inputs: {
        marginTop: -100,
    },
    form: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        height: 30,
        borderRadius: 3,
        paddingHorizontal: 5,
        marginTop: 10,
    },
    eyeIcon: {
        marginRight: 10,
    },
    label: {
        fontSize: 14,
    },
    manterLogin: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    butaoManter: {
        width: 260,
        fontSize: 14,
        color: '#0D11F0',
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    botao: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoEntrar: {
        backgroundColor: '#ff3838',
        width: 100,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 15,
    },
});
