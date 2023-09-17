import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { View, Text, Image } from 'react-native'
import { AlertDialog, Center, VStack, Skeleton, Button } from 'native-base'
import { CommonActions } from '@react-navigation/native';

export default function Index({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeveloper, setIsDeveloper] = useState(false)

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, []);
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsDeveloper(true);
        }

      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    getToken();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post('http://192.168.10.117:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.removeItem('authToken');
      navigation.push('Login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Center w="100%" >
        <VStack w="90%" my="4" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }}>
          <Skeleton h="40" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
        </VStack>
        <VStack w="90%" maxW="400" borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }}>
          <Skeleton h="40" />
          <Skeleton.Text px="4" />
          <Skeleton px="4" my="4" rounded="md" startColor="primary.100" />
        </VStack>
      </Center>
      <AlertDialog isOpen={isDeveloper}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            <Image source={{ uri: 'https://reemplacamiento.yucatan.gob.mx/img/mantenimiento.gif' }} style={{ width: '50%', height: 150 }} alignSelf="center" />
            <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 30, marginBottom: 10 }}>Lo sentimos</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center' }}>La aplicacion se encuentra en desarrollo, vuelve a intentarlo mas tarde</Text>
            <Button style={{ marginVertical: 20 }} onPress={handleLogout}>Cerrar sesión</Button>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <AlertDialog isOpen={isLoading}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            <Image source={{ uri: 'https://www.ewfm.co.uk/wp-content/uploads/2022/05/one_loader.gif' }} style={{ width: '50%', height: 100 }} alignSelf="center" />
            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', marginVertical: 30 }}>Cerrando sesion... por favor espera</Text>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  )
}