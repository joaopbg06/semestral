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
    ActivityIndicator,
    FlatList
} from 'react-native';

import { supabase } from '../supabase';
import Post from '../components/post';

import { useRoute } from '@react-navigation/native';


function HomeScreen() {
    const [filtroAtivo, setFiltroAtivo] = useState('Geral');
    const [posts, setPosts] = useState([]);


    const handleFiltroPress = (filtro) => {
        setFiltroAtivo(filtro);
        console.log('Filtro ativo alterado para:', filtro);
    };

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('post') // Nome da tabela
                .select('*'); // Busca todas as colunas

            if (error) {
                console.error('Erro ao buscar posts:', error.message);
                return;
            }

            console.log('Posts recebidos do banco de dados:', data); // Verificar os dados recebidos
            setPosts(data); // Atualiza o estado "posts" com os dados retornados
        } catch (err) {
            console.error('Erro inesperado ao buscar posts:', err);
        }
    };

    useEffect(() => {
        fetchPosts(); // Busca os posts ao montar o componente
    }, []);

    const deletePost = async (postId) => {
        try {
            const { error } = await supabase
                .from('post') // Nome da tabela
                .delete()     // Método para deletar
                .eq('id', postId); // Condição: deleta o post com o ID correspondente

            if (error) {
                console.error('Erro ao deletar post:', error.message);
                alert('Não foi possível deletar o post. Tente novamente.');
            } else {
                alert('Post deletado com sucesso!');
                fetchPosts(); // Atualiza a lista de posts
            }
        } catch (err) {
            console.error('Erro inesperado ao deletar post:', err);
            alert('Ocorreu um erro inesperado ao deletar o post.');
        }
    };

    // Filtra os posts com base no filtro ativo
    const filteredPosts = filtroAtivo === 'Geral'
        ? posts // Exibe todos os posts
        : posts.filter(post => {
            const postTipo = post.tipo.toLowerCase(); // Converter o tipo do post para minúsculo
            const filtro = filtroAtivo.toLowerCase(); // Converter o filtro ativo para minúsculo
            console.log(`Post: ${post.id} - Tipo: ${postTipo}, Filtro Ativo: ${filtro}`);
            return postTipo === filtro;
        });

    console.log('Posts após aplicação do filtro:', filteredPosts);


    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>

            <View style={home.header}>
                <Image style={home.logo} source={require('../assets/img/logo.png')}></Image>

                <View style={home.linha1}></View>

                <View style={home.filtroBox}>
                    <Pressable
                        style={filtroAtivo === 'Geral' ? home.filtroAtivo : home.filtro}
                        onPress={() => handleFiltroPress('Geral')}
                    >
                        <Text style={home.textoFiltro}>Geral</Text>
                    </Pressable>

                    <Pressable
                        style={filtroAtivo === 'Enquete' ? home.filtroAtivo : home.filtro}
                        onPress={() => handleFiltroPress('Enquete')}
                    >
                        <Text style={home.textoFiltro}>Enquetes</Text>
                    </Pressable>

                    <Pressable
                        style={filtroAtivo === 'Cardapio' ? home.filtroAtivo : home.filtro}
                        onPress={() => handleFiltroPress('Cardapio')}
                    >
                        <Text style={home.textoFiltro}>Cardápio</Text>
                    </Pressable>

                    <Pressable
                        style={filtroAtivo === 'Sugestao' ? home.filtroAtivo : home.filtro}
                        onPress={() => handleFiltroPress('Sugestao')}
                    >
                        <Text style={home.textoFiltro}>Sugestões</Text>
                    </Pressable>
                </View>

                <View style={home.linha2}></View>
            </View>

            <View style={home.main}>

                <FlatList
                    data={filteredPosts} // Usa os posts filtrados
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Post
                                texto={item.texto}
                                imagens={item.imagens}
                                imagem={item.imagem}
                                tipo={item.tipo}
                                opcoes={item.opcoes}
                                id={item.id}
                                del={deletePost}
                                user_id={item.user_id}
                                view_user={false}
                            />
                            <View style={{
                                width: '95%',
                                height: 2,
                                backgroundColor: '#ff0000',
                                opacity: 0.18,
                                alignSelf: 'center',
                                marginVertical: 25,
                            }} />
                        </View>
                    )}
                    style={{
                        width: '100%', marginTop: 20
                    }}
                />
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

const Tab = createBottomTabNavigator();

export default function Acesso() {

    const route = useRoute(); // Hook para acessar os parâmetros da rota
    const { id: id } = route.params || {}; // Desestrutura o parâmetro `ok` (id passado)

    console.log('ID recebido no Acesso:', id); // Use para verificar se o valor está chegando

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    // Retorna o ícone apropriado da biblioteca Ionicons
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#fff', // Cor do texto e ícone ativo
                tabBarInactiveTintColor: '#fff',  // Cor do texto e ícone inativo
                tabBarStyle: {                     // Estilos para a barra de abas
                    backgroundColor: '#FF3838',         // Cor de fundo da barra de abas
                    borderTopColor: '#ccc',          // Cor da borda superior da barra
                    borderTopWidth: 1,               // Largura da borda superior da barra
                    height: 60,                       // Altura da barra de abas
                },
                tabBarLabelStyle: {                 // Estilos para os rótulos
                    fontSize: 14,                     // Tamanho da fonte dos rótulos
                    marginBottom: 5,                  // Margem inferior dos rótulos
                },
                tabBarLabelStyle: {
                    display: 'none', // Oculta os rótulos
                },
                tabBarIconStyle: {                  // Estilos para os ícones
                    marginTop: 5,                     // Margem superior dos ícones
                }
            })}
        >
            <Tab.Screen initialParams={{ id }} name="Home" component={HomeScreen} options={{ headerShown: false }} />
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

const home = StyleSheet.create({
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
        width: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        marginTop: -45
    },
});
