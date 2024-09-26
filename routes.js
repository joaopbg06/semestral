import { createStackNavigator } from '@react-navigation/stack';
import login from './pages/login';
import index from './pages/aluno';


const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="login"
                component={login}
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name="index"
                component={index}
                options={{ headerShown: false }} 
            />



        </Stack.Navigator>
    )
} 