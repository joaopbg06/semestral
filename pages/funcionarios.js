import React, { useState } from 'react';
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
    Pressable
} from 'react-native';



// Defina algumas telas exemplo para as suas tabs
function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>

            <View style={index.header}>
                <Image style={index.logo} source={require('../assets/img/logo.png')}></Image>
                <View style={index.linha1}></View>
                <View style={index.filtroBox}>
                    <View style={index.filtroAtivo}>
                        <Text style={index.textoFiltro}>Geral</Text>
                    </View>

                    <View style={index.filtro}>
                        <Text style={index.textoFiltro}>Enquetes</Text>
                    </View>

                    <View style={index.filtro}>
                        <Text style={index.textoFiltro}>Cardápio</Text>
                    </View>

                    <View style={index.filtro}>
                        <Text style={index.textoFiltro}>Sugestões</Text>
                    </View>

                </View>
                <View style={index.linha2}></View>
            </View>

            <View style={index.main}></View>

        </View>

    );
}

function SettingsScreen() {

    const [isToggled, setIsToggled] = useState(false);

    const toggleSwitch = () => {
        setIsToggled(prev => !prev);
    };

    return (
        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <View style={config.perfil}>

                <Image style={config.imagemAluno} source={require('../assets/img/alunoFt.png')}></Image>
                <Text style={config.nomeAluno}>Nome da nutricionista</Text>
            </View>

            <View style={config.contato}>

                <Text style={config.titulo}>contato</Text>

                <View>
                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'call'} size={24} color={'#000'} />
                            <Text style={config.desc}> Telefone </Text>
                        </View>
                        <Text style={config.assunto}> (+55) 11 12345-6789 </Text>
                    </View>

                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'mail'} size={24} color={'#000'} />
                            <Text style={config.desc}> Email </Text>
                        </View>
                        <Text style={config.assunto}> nome.sobrenome@portalsesisp.org.br </Text>
                    </View>
                </View>

            </View>

            <View style={config.config}>
                <Text style={config.titulo}>Configuração</Text>

                <View>
                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'notifications'} size={24} color={'#000'} />
                            <Text style={config.desc}> Notificação </Text>
                        </View>
                        <Pressable onPress={toggleSwitch}>
                            <FontAwesome6
                                name={isToggled ? "toggle-on" : "toggle-off"}
                                size={24}
                                color={isToggled ? "#ff3838" : "#ff3838"}
                            />
                        </Pressable>
                    </View>

                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'menu'} size={24} color={'#000'} />
                            <Text style={config.desc}> Termos </Text>
                        </View>
                        <Ionicons name={'chevron-forward'} size={24} color={'#727272'} />
                    </View>
                </View>
            </View>
        </View >
    );
}

function Dashboard() {
    return (
        <View>
            <Text>dashboard</Text>
        </View>
    );
}

function Chat() {
    return (
        <View>
            <Text>Chat</Text>
        </View>
    );
}

function Laudo() {
    return (
        <View>
            <Text>Laudo</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function Acesso() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;

                    // Lógica para selecionar o ícone com base no nome da aba (route.name)
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Dashboard') {
                        iconName = focused ? 'people' : 'people-outline'; // Ícone para Dashboard
                    } else if (route.name === 'Chatbox') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; // Ícone para Chatbox
                    } else if (route.name === 'Laudo') {
                        iconName = focused ? 'document-text' : 'document-text-outline'; // Ícone para Laudo
                    }

                    // Retorna o ícone apropriado da biblioteca Ionicons
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#fff', // Cor do texto e ícone ativo
                tabBarInactiveTintColor: '#fff', // Cor do texto e ícone inativo
                tabBarStyle: { // Estilos para a barra de abas
                    backgroundColor: '#FF3838', // Cor de fundo da barra de abas
                    borderTopColor: '#ccc', // Cor da borda superior da barra
                    borderTopWidth: 1, // Largura da borda superior da barra
                    height: 60, // Altura da barra de abas
                },
                tabBarLabelStyle: {
                    display: 'none', // Oculta os rótulos
                },
                tabBarIconStyle: { // Estilos para os ícones
                    marginTop: 5, // Margem superior dos ícones
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Tab.Screen name="Chatbox" component={Chat} options={{ headerShown: false }} />
            <Tab.Screen name="Laudo" component={Laudo} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />

        </Tab.Navigator>
    );
}

const config = StyleSheet.create({
    perfil: {
        flex: 2,
        width: '100%',
        backgroundColor: "#FF3838",
        justifyContent: 'center',
        alignItems: 'center'
    },
    nomeAluno: {
        marginTop: 10,
        fontSize: 20,
        color: '#fff'
    },
    contato: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    box: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 0.5,         // Largura da borda superior
        borderBottomWidth: 0.5,      // Largura da borda inferior
        borderTopColor: 'rgba(0, 0, 0, 0.2)',    // Cor da borda superior
        borderBottomColor: 'rgba(0, 0, 0, 0.2)', // Cor da borda inferior    
    },
    titulo: {
        fontSize: 14,
        color: '#727272',
        marginVertical: 20
    },
    a: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    desc: {
        fontSize: 13
    },
    assunto: {
        color: '#727272',
        fontSize: 12
    },
    config: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});

const index = StyleSheet.create({
    header: {
        marginTop: 10,
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    linha1: {
        marginTop: 6,
        width: 280,
        height: 2,
        backgroundColor: '#ff3838'
    },
    linha2: {
        width: "100%",
        height: 2,
        backgroundColor: '#ff3838'
    },
    filtroBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 8
    },
    filtro: {
        borderRadius: 25,
        backgroundColor: '#F3F3F3',
        borderColor: '#9F9F9F',
        borderWidth: 0.3,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    filtroAtivo: {
        borderRadius: 25,
        backgroundColor: '#F9DCDC',
        borderColor: '#F9DCDC',
        borderWidth: 0.3,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textoFiltro: {
        fontSize: 12,
    },
    main: {
        flex: 4,
    },
});
