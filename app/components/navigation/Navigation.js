import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native'
import { Iconify } from 'react-native-iconify';

import Splash from '../../modules/auth/Splash'
import Login from '../../modules/auth/Login'
import Register from '../../modules/auth/Register'
import Home from '../../modules/home/Home'
import Profile from '../../modules/profile/Profile'

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Group
                screenOptions={{ headerStyle: { backgroundColor: '#47a61d' }, headerTintColor: '#fff', }}
            >
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} initialRouteName />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Group
                    screenOptions={{
                        headerLeft: false,
                        gestureEnabled: false,
                        headerStyle: { backgroundColor: '#fff' },
                        headerTintColor: '#fff',
                        headerTitle: () => <Iconify icon="pepicons-pop:menu" color="#47a61d" size={35} />,
                        headerRight: () => <Image 
                            source={{ uri: 'https://i.ibb.co/cNqCZcj/tmr-logo-1.png' }}
                            style={{
                                width: 120,
                                height: 120,
                                resizeMode: 'contain',
                                marginRight: 10,
                            }}
                        />
                    }}
                >
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Profile" component={Profile} />
                </Stack.Group>
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default function index() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    )
}