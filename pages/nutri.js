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
import Contato from '../components/contato';
import LaudoAluno from '../components/laudo';
import ContatoPai from '../components/contatoPai';
import ChatApp from '../components/chat';
import Post from '../components/post';

import { supabase } from '../supabase';

import { useRoute } from '@react-navigation/native';

//paginas

function HomeScreen({ route }) {
    const [filtroAtivo, setFiltroAtivo] = useState('Geral');
    const [isModalVisible, setModalVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const { id } = route.params || {};

    const handleFiltroPress = (filtro) => {
        setFiltroAtivo(filtro);
        console.log('Filtro ativo alterado para:', filtro);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
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
                                tipo={item.tipo}
                                opcoes={item.opcoes}
                                id={item.id}
                                del={deletePost}
                                user_id={item.user_id}
                                view_user={true}
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

            <Pressable onPress={openModal} style={home.botaoAdicionar}>
                <Ionicons name={'add-outline'} size={30} color={'#fff'} />
            </Pressable>

            {isModalVisible && (
                <Adicionar
                    visible={isModalVisible}
                    onClose={closeModal}
                    user_id={id}
                    fetchPosts={fetchPosts}
                />
            )}
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


const Dashboard = () => {

    return (
        <ScrollView style={dash.container}>


        </ScrollView>
    );
};

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


const Laudo = () => {
    const [pesquisa, setPesquisa] = useState(''); // Para o filtro de pesquisa
    const [laudos, setLaudos] = useState([]); // Estado para armazenar os dados da tabela `laudo`
    const [loading, setLoading] = useState(true); // Estado para indicar carregamento
    const [modalVisible, setModalVisible] = useState(false); // Controle do modal
    const [selectedContato, setSelectedContato] = useState(null); // Contato selecionado

    // Função para lidar com a mudança do campo de pesquisa
    const handleInputChange = (text) => {
        setPesquisa(text);
    };

    // Função para buscar os laudos e os perfis associados
    const fetchLaudos = async () => {
        setLoading(true); // Ativa o indicador de carregamento

        // Buscar todos os laudos
        const { data: laudosData, error: laudosError } = await supabase
            .from('laudo') // Nome da tabela
            .select('*'); // Seleciona todas as colunas

        if (laudosError) {
            console.error('Erro ao buscar laudos:', laudosError.message);
            setLoading(false);
            return;
        }

        // Para cada laudo, buscamos o perfil correspondente ao user_id
        const laudosComPerfis = await Promise.all(
            laudosData.map(async (laudo) => {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles') // Nome da tabela de perfis
                    .select('*') // Seleciona todas as colunas
                    .eq('id', laudo.user_id) // Filtra pelo user_id do laudo
                    .single(); // Retorna apenas um perfil

                if (profileError) {
                    console.error('Erro ao buscar perfil para o laudo:', profileError.message);
                    return { ...laudo, profile: null }; // Caso ocorra erro, coloca `null` para o perfil
                }

                // Retorna o laudo com as informações do perfil associadas
                return { ...laudo, profile: profileData };
            })
        );

        setLaudos(laudosComPerfis); // Atualiza o estado com os laudos com os perfis associados
        setLoading(false); // Desativa o indicador de carregamento
    };

    useEffect(() => {
        fetchLaudos();
    }, []);

    // Função para filtrar os laudos com base no nome do perfil
    const filteredLaudos = laudos.filter((laudo) => {
        const nome = laudo.profile?.nome || ''; // Garantir que profile não seja null ou undefined
        return nome.toLowerCase().includes(pesquisa.toLowerCase()); // Filtro insensível a maiúsculas/minúsculas
    });

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: `#fff` }}>

            <View style={laudo.header}>
                <Image style={laudo.logo} source={require('../assets/img/logo.png')} />
                <View style={laudo.linha1}></View>

                <View style={laudo.pesquisa}>
                    <TextInput
                        style={laudo.input}
                        value={pesquisa}
                        onChangeText={handleInputChange}
                        placeholder="Pesquise aqui..."
                    />
                    <Ionicons name={"search-sharp"} size={24} color={"#000"} />
                </View>

                <View style={laudo.linha2}></View>
            </View>

            {/* Aqui aplicamos o filtro nos laudos */}
            <FlatList
                style={{ flex: 1, width: '90%' }}
                keyExtractor={(item) => String(item.id)}
                data={filteredLaudos}  // Agora estamos passando os laudos filtrados
                renderItem={({ item }) => (
                    <Contato data={item} /> // Passando o item completo, que inclui a propriedade 'profile'
                )}
            />

        </View>
    );
};



//bottons tab

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
                    } else if (route.name === 'Dashboard') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Chatbox') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Laudo') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    }

                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#FF3838',
                    height: 60,
                },
                tabBarLabelStyle: {
                    display: 'none',
                },
                tabBarIconStyle: {
                    marginTop: 5,
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
                initialParams={{ id }} // Passa o `id` para o HomeScreen
            />
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
                initialParams={{ id }} // Passa o `id` para o Dashboard
            />
            <Tab.Screen
                name="Chatbox"
                component={Chat}
                options={{ headerShown: false }}
                initialParams={{ id }} // Passa o `id` para o Chat
            />
            <Tab.Screen
                name="Laudo"
                component={Laudo}
                options={{ headerShown: false }}
                initialParams={{ id }} // Passa o `id` para o Laudo
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
                initialParams={{ id }} // Passa o `id` para o Settings
            />
        </Tab.Navigator>
    );
}

//styles

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
    botaoAdicionar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#ff3838',
        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        right: 10,
        bottom: 10
    },

});

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

const dash = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    chartContainer: {
        backgroundColor: '#f0f0f0', // Fundo cinza para o quadrado
        borderRadius: 16, // Bordas arredondadas
        padding: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartStyle: {
        borderRadius: 16,
        overflow: 'hidden', // Garante que as bordas arredondadas não sejam sobrescritas
    },
    header: {
        alignItems: "center",
        marginVertical: 20,
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: "contain",
    },
    linha1: {
        width: "80%",
        height: 2,
        backgroundColor: "red",
        marginTop: 5,
    },
    dash1: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
    },
    caixa1: {
        backgroundColor: "#F0F0F0",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: "45%",
    },
    caixa2: {
        backgroundColor: "#F0F0F0",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: "45%",
    },
    textoCaixa: {
        fontSize: 20,
        fontWeight: "bold",
    },
    tituloCaixa: {
        fontSize: 15,
    },
    numeroCaixa: {
        fontSize: 25,
        fontWeight: "bold",
    },
    chartContainer: {
        backgroundColor: "#F0F0F0",
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
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

const laudo = StyleSheet.create({
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
        height: 30,
    }

});





