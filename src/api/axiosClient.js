import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mobilde localhost çalışmaz — bilgisayarın yerel IP adresi kullanılır
const BASE_URL = 'http://10.199.170.19:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('bb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
