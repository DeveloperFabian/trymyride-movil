import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({ navigation }) {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    if (animationFinished) {
      checkToken();
    }
  }, [animationFinished, navigation]);

  return (
    <LottieView
      source={require('./../../components/assets/json/splash.json')}
      duration={3500}
      autoPlay
      loop={false}
      style={{
        flex: 1,
      }}
      onAnimationFinish={() => setAnimationFinished(true)}
    />
  );
}
