import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axiosClient';
import useAuthStore from '../store/authStore';

export default function LoginScreen({ navigation }) {
  const { login } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre boş olamaz.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await login(data.token, data.user);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Giriş Hatası', err.response?.data?.error || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pb-8 justify-center">

            {/* Logo alanı */}
            <View className="items-center mb-8">
              <Text className="text-5xl mb-2">🪷</Text>
              <Text className="font-bold text-3xl text-[#1B6B5C] italic">Welcome to</Text>
              <Text className="font-bold text-3xl text-[#111B4E]">Booking Borelia!</Text>
              <Text className="text-gray-500 italic mt-1">Located in Bali 🌿</Text>
            </View>

            {/* Form kartı */}
            <View className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-3.5 mb-3 text-sm text-gray-700"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-3.5 mb-5 text-sm text-gray-700"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />

              <TouchableOpacity
                className="bg-[#111B4E] rounded-full py-4 items-center"
                onPress={handleLogin}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white font-semibold text-base">Log in</Text>
                }
              </TouchableOpacity>
            </View>

            {/* Alt linkler */}
            <View className="flex-row justify-between mt-5 px-1">
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text className="text-gray-500 text-sm">Don't have an account?</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-500 text-sm">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
