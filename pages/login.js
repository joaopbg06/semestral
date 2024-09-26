import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Bem_Vindo() {

const navigation=useNavigation()

    return (
        <View style={styles.container}>
            <Text>Bem-vindo!</Text>
            <TouchableOpacity style={{borderWidth:2}} onPress={() => navigation.navigate('index')}>
                <Text>Acessar</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
