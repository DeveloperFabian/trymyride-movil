import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { Box, FormControl, Input, Button, AlertDialog } from 'native-base'
import { Iconify } from 'react-native-iconify';

export default function Index({ navigation }) {
  const [alert, setAlert] = useState(false)
  const [message, setMessage] = useState('')
  const onClose = () => setAlert(false);
  const cancelRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        'http://192.168.10.13:8000/api/update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message)
        setAlert(true)
      } else {
        console.error('Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await axios.get('http://192.168.10.13:8000/api/account');
          console.log(response.data.user)
          if (response.status === 200) {
            setFormData({
              name: response.data.user.name,
              email: response.data.user.email,
              password: '',
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        navigation.navigate('Login')
      }
    };
    loadUserData();
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
      <ScrollView>
        <View style={{ width: responsiveScreenWidth(100) }}>
          <Box alignSelf="center" borderRadius={10} style={{ width: responsiveScreenWidth(90), marginVertical: 50, padding: 20, backgroundColor: '#fff', elevation: 6 }}>
            <View style={styles.inputRow}>
              <Image source={{ uri: 'https://i.ibb.co/cNqCZcj/tmr-logo-1.png' }} style={{ width: '75%', height: 80 }} />
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Nombre y apellido <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input value={formData.name} onChangeText={text => setFormData({ ...formData, name: text })} />
              </FormControl>
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Correo electrónico <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input value={formData.email} onChangeText={text => setFormData({ ...formData, email: text })} />
              </FormControl>
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Contraseña <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input secureTextEntry onChangeText={text => setFormData({ ...formData, password: text })} />
              </FormControl>
            </View>
            <View style={[styles.inputRow, { justifyContent: 'flex-end' }]}>
              <Button style={{ backgroundColor: '#47a61d', marginRight: 10 }} onPress={updateProfile} disabled={isLoading}>
                Editar perfil
              </Button>
              <Button style={{ backgroundColor: 'red' }} onPress={handleLogout} disabled={isLoading}>
                Cerrar sesión
              </Button>
            </View>
          </Box>
        </View>
      </ScrollView>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alert} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="emojione-v1:left-check-mark" size={100} color="#900" alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 20, fontWeight: '700' }}>{message}</Text>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  )
}

const styles = StyleSheet.create({
  cardPicker: {
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: 5
  },
  inputRow: {
    flexDirection: "row",
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10
  }
})