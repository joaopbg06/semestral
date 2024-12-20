

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
    Modal
} from 'react-native';

import Adicionar from '../components/adicionar'
import Contato from '../components/contato';
import LaudoAluno from '../components/laudo';
import ContatoPai from '../components/contatoPai';
import ChatApp from '../components/chat';
import Post from '../components/post';

import { supabase } from '../supabase';

import { useRoute } from '@react-navigation/native';


// Defina algumas telas exemplo para as suas tabs
function HomeScreen({ route }) {
    const [dados, setDados] = useState([]);
    const { id } = route.params || {};

    const fetchUserProfile = async (id) => {
        try {
            // Passo 1: Buscar o id_relacionado com o id do usuário
            const { data, error } = await supabase
                .from('profiles') // Nome da tabela
                .select('id_relacionado') // Seleciona o campo id_relacionado
                .eq('id', id) // Filtra pelo id do usuário
                .single(); // Retorna apenas um registro

            if (error) {
                console.error('Erro ao buscar id_relacionado:', error.message);
                return null; // Retorna null em caso de erro
            }

            const idRelacionado = data?.id_relacionado;

            if (!idRelacionado) {
                console.error('Usuário não tem um id_relacionado');
                return null;
            }

            // Passo 2: Buscar as informações do usuário relacionado
            const { data: relatedUserData, error: relatedUserError } = await supabase
                .from('profiles') // Nome da tabela
                .select('*') // Seleciona todas as colunas
                .eq('id', idRelacionado) // Filtra pelo id_relacionado
                .single(); // Retorna apenas um registro

            if (relatedUserError) {
                console.error('Erro ao buscar o perfil do usuário relacionado:', relatedUserError.message);
                return null; // Retorna null em caso de erro
            }

            // Aqui você pode retornar os dados tanto do usuário original quanto do relacionado
            // Exemplo: retornar um objeto com ambos os perfis
            setDados(relatedUserData)

        } catch (err) {
            console.error('Erro inesperado ao buscar perfil:', err);
            return null;
        }
    };

    useEffect(() => {
        fetchUserProfile(id); // Chama a função para buscar os dados
    }, []);



    const handlePdf = async () => {
        console.log('opa')
    };

    return (
        <View style={index.conteiner}>
            <View style={index.header}>
                <Image style={index.logo} source={require('../assets/img/logo.png')}></Image>
                <View style={index.linha1}></View>
            </View>


            <View style={index.perfil}>

                <Image style={index.imagemAluno} source={require('../assets/img/alunoFt.png')}></Image>
                <Text style={index.nomeAluno}>{dados.nome}</Text>
            </View>

            <View style={index.contato}>

                <Text style={index.titulo}>contato</Text>

                <View>
                    <View style={index.box}>
                        <View style={index.a}>
                            <Ionicons name={'call'} size={24} color={'#000'} />
                            <Text style={index.desc}> Telefone </Text>
                        </View>
                        <Text style={index.assunto}> {dados.telefone} </Text>
                    </View>

                    <View style={index.box}>
                        <View style={index.a}>
                            <Ionicons name={'mail'} size={24} color={'#000'} />
                            <Text style={index.desc}> Email </Text>
                        </View>
                        <Text style={index.assunto}> {dados.email} </Text>
                    </View>
                </View>

            </View>

            <View style={index.botao}>
                <Pressable onPress={handlePdf} style={index.botaoEntrar}>
                    <Text style={index.textoBotao}>Enviar Laudo</Text>
                    <Ionicons name={'arrow-up'} size={24} color={'#fff'} />
                </Pressable>
            </View>
        </View>
    );
}

function SettingsScreen({ route }) {

    const [isToggled, setIsToggled] = useState(false);
    const [dados, setDados] = useState([]);
    const { id } = route.params || {};

    const toggleSwitch = () => {
        setIsToggled(prev => !prev);
    };

    const fetchUserProfile = async (id) => {

        try {
            const { data, error } = await supabase
                .from('profiles') // Nome da tabela
                .select('*') // Seleciona todas as colunas
                .eq('id', id) // Filtra pelo id do usuário
                .single(); // Retorna apenas um registro

            if (error) {
                console.error('Erro ao buscar perfil:', error.message);
                return null; // Retorna null em caso de erro
            }

            setDados(data)
        } catch (err) {
            console.error('Erro inesperado ao buscar perfil:', err);
            return null;
        }
    };

    useEffect(() => {
        fetchUserProfile(id); // Chama a função para buscar os dados
    }, []);

    return (
        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: `#fff` }}>

            <View style={config.perfil}>

                <Image style={config.imagemAluno} source={require('../assets/img/alunoFt.png')}></Image>
                <Text style={config.nomeAluno}> {dados.nome} </Text>
            </View>

            <View style={config.contato}>

                <Text style={config.titulo}>contato</Text>

                <View>
                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'call'} size={24} color={'#000'} />
                            <Text style={config.desc}> Telefone </Text>
                        </View>
                        <Text style={config.assunto}> {dados.telefone} </Text>
                    </View>

                    <View style={config.box}>
                        <View style={config.a}>
                            <Ionicons name={'mail'} size={24} color={'#000'} />
                            <Text style={config.desc}> Email </Text>
                        </View>
                        <Text style={config.assunto}> {dados.email} </Text>
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

function Chat({ route }) {

    const [pesquisa, setPesquisa] = useState('');
    const [users, setUsers] = useState([]);
    const { id } = route.params || {};

    const handleInputChange = (text) => {
        setPesquisa(text);
        console.log('Input na pesquisa:', text); // Para visualizar a entrada atual
    };

    const fetchUsers = async (id) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, nome, categoria')  // Selecionando a coluna 'categoria' também
                .neq('id', id)  // Exclui o ID do usuário logado
                .in('categoria', ['nutricionista', 'pais']);  // Filtra pelas categorias 'nutricionista' e 'pais'

            if (error) {
                console.error('Erro ao buscar usuários:', error.message);
                return [];
            }

            return data;  // Retorna os usuários que são 'nutricionista' ou 'pais', exceto o logado
        } catch (err) {
            console.error('Erro inesperado:', err);
            return [];
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            const allUsers = await fetchUsers(id);
            setUsers(allUsers);
        };

        loadUsers();
    }, [id]);

    // Filtra os usuários com base na pesquisa
    const filteredUsers = users.filter((user) =>
        user.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: `#fff` }}>

            <View style={chat.header}>
                <Image style={chat.logo} source={require('../assets/img/logo.png')}></Image>
                <View style={chat.linha1}></View>

                <View style={chat.pesquisa}>

                    <TextInput
                        style={chat.input}
                        value={pesquisa}
                        onChangeText={handleInputChange}
                        placeholder="Pesquise aqui..."
                    />

                    <Ionicons name={"search-sharp"} size={24} color={"#000"} />

                </View>

                <View style={chat.linha2}></View>
            </View>

            <FlatList style={{ flex: 1, width: '90%' }}
                keyExtractor={(item) => String(item.id)}
                data={filteredUsers} // Use os usuários filtrados
                renderItem={({ item }) => (
                    <ContatoPai data={item} ida={id} />
                )}
            />


        </View>
    );

}


const Tab = createBottomTabNavigator();

export default function Acesso() {

    const route = useRoute(); // Hook para acessar os parâmetros da rota
    const { id: id } = route.params || {}; // Desestrutura o parâmetro `ok` (id passado)

    console.log('ID recebido no Acesso:', id);

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
            <Tab.Screen initialParams={{ id }} name="Home" component={HomeScreen} options={{ headerShown: false }} />

            <Tab.Screen initialParams={{ id }} name="Chatbox" component={Chat} options={{ headerShown: false }} />
            <Tab.Screen initialParams={{ id }} name="Settings" component={SettingsScreen} options={{ headerShown: false }} />

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
        alignItems: 'center'
    },
    linha1: {
        marginTop: 6,
        width: 280,
        height: 2,
        backgroundColor: '#ff3838'
    },
    conteiner: {
        flex: 1,
    },
    botao: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' // Espaçamento fora do botão (opcional)
    },
    botaoEntrar: {
        flexDirection: 'row', // Alinha o texto e o ícone horizontalmente
        alignItems: 'center', // Alinha verticalmente ao centro
        justifyContent: 'center', // Centraliza o conteúdo dentro do botão
        backgroundColor: '#ff3838', // Cor de fundo do botão
        paddingVertical: 10, // Espaçamento interno vertical
        paddingHorizontal: 20, // Espaçamento interno horizontal
        borderRadius: 8, // Bordas arredondadas
        width: "80%",
    },
    textoBotao: {
        color: '#fff', // Cor do texto
        fontSize: 16, // Tamanho da fonte
        marginRight: 10, // Espaçamento entre o texto e o ícone
    },
    perfil: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    nomeAluno: {
        marginTop: 10,
        fontSize: 20,
        color: '#000'
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

const chat = StyleSheet.create({
    header: {
        marginTop: 10,
        width: '100%',
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
    pesquisa: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: '#ECECEC',

        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginVertical: 7,
    },
    input: {
        height: 30
    }
});
