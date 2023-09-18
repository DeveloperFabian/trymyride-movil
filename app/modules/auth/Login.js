import React, { useState, useEffect } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, ScrollView } from 'react-native'
import { responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { Center, Box, Heading, VStack, FormControl, Input, Link, Button, HStack, StatusBar, AlertDialog } from 'native-base'
import { Iconify } from 'react-native-iconify';
import Config from '../../components/api/Config';

export default function Login({ navigation }) {
  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertError, setAlertError] = useState(false)
  const [messageError, setMessageError] = useState('')
  const onCloseError = () => setAlertError(false);
  const cancelRef = React.useRef(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${Config.apiUrl}/api/login`, {
        email: email,
        password: password,
      });

      if (response.data.status === 401) {
        setMessageError(response.data.message)
        setAlertError(true)
      } else if (response.data.status === 402) {
        setMessageError(response.data.message)
        setAlertError(true)
        console.log(response.data)
      } else {
        const token = response.data.access_token;

        setEmail('');
        setPassword('');

        await AsyncStorage.setItem('authToken', token);

        navigation.push('Home')
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ width: responsiveScreenWidth(100), flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 50 }}>
          <Image source={{ uri: 'https://i.ibb.co/cNqCZcj/tmr-logo-1.png' }} style={{ width: '100%', height: 100, marginTop: 75 }} />
        </View>
        <View style={{ width: responsiveScreenWidth(100) }}>
          <Center w="100%">
            <Box safeArea p="2" py="5" w="90%" maxW="300">
              <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                color: "warmGray.50"
              }}>
                Bienvenido
              </Heading>
              <Heading mt="1" _dark={{
                color: "warmGray.200"
              }} color="coolGray.600" fontWeight="medium" size="xs">Por favor escribe tus credenciales
              </Heading>

              <VStack space={3} mt="5">
                <FormControl>
                  <FormControl.Label>Correo electrónico</FormControl.Label>
                  <Input onChangeText={setEmail} />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Contraseña</FormControl.Label>
                  <Input type="password" onChangeText={setPassword} secureTextEntry />
                  <Link _text={{
                    fontSize: "xs",
                    fontWeight: "700",
                    color: "indigo.500"
                  }} alignSelf="flex-end" mt="1">¿Olvidaste tu contraseña?
                  </Link>
                </FormControl>
                <Button mt="2" style={{ backgroundColor: '#47a61d' }} onPress={handleLogin}>Iniciar sesión
                </Button>
                <HStack mt="6" justifyContent="center" alignItems="center">
                  <Text fontSize="sm" color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }}>
                    ¿No tienes una cuenta?
                  </Text>
                  <Link _text={{
                    color: "indigo.500",
                    fontWeight: "700",
                    fontSize: "sm"
                  }} onPress={() => navigation.navigate('Register')} style={{ marginLeft: 10 }}>Registrate
                  </Link>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </View>
      </ScrollView>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertError} onClose={onCloseError}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="teenyicons:password-solid" size={100} color={'#47a61d'} alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 20, fontWeight: '700' }}>{messageError}</Text>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <StatusBar />
    </View>
  )
}