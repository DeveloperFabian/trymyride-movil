import React, { useState } from 'react'
import axios from 'axios';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native'
import { responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { Box, FormControl, Input, StatusBar, Button, AlertDialog } from 'native-base'
import { Iconify } from 'react-native-iconify';

export default function Register({ navigation }) {

  const [missingFields, setMissingFields] = useState([]);
  const [errorFieldsExist, setErrorFieldsExist] = useState([]);
  const [isOpenValidation, setIsOpenValidation] = React.useState(false);
  const [isOpenError, setIsOpenError] = React.useState(false);
  const [isOpenErrorServer, setIsOpenErrorServer] = React.useState(false);
  const [isOpenSuccess, setIsOpenSuccess] = React.useState(false);
  const onCloseValidation = () => setIsOpenValidation(false);
  const onCloseError = () => setIsOpenError(false);
  const onCloseErrorServer = () => setIsOpenErrorServer(false);
  const onCloseSuccess = () => {
    setIsOpenSuccess(false);
    setTimeout(() => {
      navigation.navigate('Login')
    }, 500);
  }
  const cancelRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const requiredFields = [
    'name',
    'email',
    'password'
  ];

  const fieldNames = {
    name: 'Nombre y apellido',
    email: 'Correo electrónico',
    password: 'Contraseña'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    const apiUrl = 'http://192.168.10.13:8000/api/register';

    const headers = {
      'Content-Type': 'application/json',
    };

    const emptyFields = requiredFields.filter(field => !formData[field]);
    const missingFieldNames = emptyFields.map(field => fieldNames[field]);

    if (emptyFields.length > 0) {
      setIsOpenSuccess(false);
      setIsOpenError(false);
      setIsOpenErrorServer(false);
      setIsOpenValidation(true);
      setMissingFields(missingFieldNames);
      setIsLoading(false);
    } else {
      try {
        setIsLoading(true);
        const response = await axios.post(apiUrl, formData, { headers });
        if (response.data.status === 200) {
          setIsLoading(false);
          setIsOpenSuccess(true);
          setIsOpenError(false);
          setIsOpenErrorServer(false);
          setIsOpenValidation(false);
        }
      } catch (error) {
        setIsLoading(false);
        if (error.response.data.status === 400) {
          setIsOpenSuccess(false);
          setIsOpenValidation(false);
          setIsOpenError(true);
          setIsOpenErrorServer(false);
          setErrorFieldsExist(error.response.data.message)
        } else {
          setIsOpenSuccess(false);
          setIsOpenValidation(false);
          setIsOpenError(false);
          setIsOpenErrorServer(true);
        }
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ width: responsiveScreenWidth(100) }}>
          <Box alignSelf="center" borderRadius={10} style={{ width: responsiveScreenWidth(90), marginVertical: 50, padding: 20, backgroundColor: '#fff', elevation: 6 }}>
            <View style={styles.inputRow}>
              <Image source={{ uri: 'https://i.ibb.co/cNqCZcj/tmr-logo-1.png' }} style={{ width: '75%', height: 80 }} />
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Nombre y apellido <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input onChangeText={text => setFormData({ ...formData, name: text })} />
              </FormControl>
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Correo electrónico <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input onChangeText={text => setFormData({ ...formData, email: text })} />
              </FormControl>
            </View>
            <View style={styles.inputRow}>
              <FormControl>
                <FormControl.Label>Contraseña <Text style={{ color: 'red' }}>*</Text></FormControl.Label>
                <Input secureTextEntry onChangeText={text => setFormData({ ...formData, password: text })} />
              </FormControl>
            </View>
            <View style={[styles.inputRow, { justifyContent: 'flex-end' }]}>
              <Button style={{ backgroundColor: '#47a61d' }} onPress={handleRegister} disabled={isLoading}>
                Crear cuenta nueva
              </Button>
            </View>
          </Box>
        </View>
      </ScrollView>

      <AlertDialog isOpen={isLoading}>
        <AlertDialog.Content>
          <AlertDialog.Body>
            <Image source={{ uri: 'https://www.ewfm.co.uk/wp-content/uploads/2022/05/one_loader.gif' }} style={{ width: '50%', height: 100 }} alignSelf="center" />
            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', marginVertical: 30 }}>Cargando... por favor espera</Text>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenValidation} onClose={onCloseValidation}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="noto:warning" size={100} color="#900" alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Estos campos son obligatorios:</Text>
              {missingFields.map((item, index) => (
                <Text style={{ textAlign: 'center' }} key={index}>{item}</Text>
              ))}
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenError} onClose={onCloseError}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="flat-color-icons:info" size={100} color="#900" alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Datos inválidos:</Text>
              {Array.isArray(errorFieldsExist) ? (
                errorFieldsExist.map((item, index) => (
                  <Text style={{ textAlign: 'center' }} key={index}>{item}</Text>
                ))
              ) : (
                <Text style={{ textAlign: 'center' }}>{errorFieldsExist}</Text>
              )}
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenErrorServer} onClose={onCloseErrorServer}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="ooui:network-off" size={100} color="#900" alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Error en el servidor</Text>
              <Text style={{ textAlign: 'center' }}>Por favor consultar con el administrador. Utiliza nuestro canal de ayuda para recibir mas información</Text>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenSuccess} onClose={onCloseSuccess}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>
            <View>
              <Iconify icon="emojione-v1:left-check-mark" size={100} color="#900" alignSelf="center" style={{ marginVertical: 20 }} />
              <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Registro exitoso</Text>
              <Text style={{ textAlign: 'center' }}>Tus datos han sido guardados</Text>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <StatusBar />
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