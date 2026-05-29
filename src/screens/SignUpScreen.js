import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axiosClient';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (val) => setForm({ ...form, [field]: val });

  const handleRegister = async () => {
    setErrors({});
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      Alert.alert('Başarılı', 'Hesabınız oluşturuldu.', [
        { text: 'Giriş Yap', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err) {
      const errData = err.response?.data?.error;
      if (errData?.fieldErrors) {
        setErrors(errData.fieldErrors);
      } else {
        Alert.alert('Hata', typeof errData === 'string' ? errData : 'Kayıt oluşturulamadı.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'firstName', placeholder: 'First Name *', type: 'default',        secure: false },
    { key: 'lastName',  placeholder: 'Last Name *',  type: 'default',        secure: false },
    { key: 'phone',     placeholder: 'Phone Number',  type: 'phone-pad',     secure: false },
    { key: 'email',     placeholder: 'Email *',        type: 'email-address', secure: false },
    { key: 'password',  placeholder: 'Password *',     type: 'default',       secure: true  },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pt-8 pb-8">

            {/* Lotus logo */}
            <View className="items-center mb-6">
              <Text className="text-6xl mb-1">🪷</Text>
              <Text className="font-bold text-2xl text-[#111B4E]">Sign Up</Text>
              <Text className="text-gray-400 text-sm mt-1">Create your Booking Borellia account</Text>
            </View>

            {/* Form */}
            <View className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
              {fields.map(({ key, placeholder, type, secure }) => (
                <View key={key} className="mb-3">
                  <TextInput
                    className="bg-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-700"
                    placeholder={placeholder}
                    value={form[key]}
                    onChangeText={set(key)}
                    keyboardType={type}
                    autoCapitalize={secure || type === 'email-address' ? 'none' : 'words'}
                    secureTextEntry={secure}
                    placeholderTextColor="#9ca3af"
                  />
                  {errors[key] && (
                    <Text className="text-red-500 text-xs mt-1 ml-2">
                      {errors[key]?.[0]}
                    </Text>
                  )}
                </View>
              ))}

              <TouchableOpacity
                className="bg-[#111B4E] rounded-full py-4 items-center mt-2"
                onPress={handleRegister}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white font-semibold text-base">Create Account</Text>
                }
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="mt-5 items-center" onPress={() => navigation.navigate('Login')}>
              <Text className="text-gray-500 text-sm">Already have an account? <Text className="text-[#111B4E] font-semibold">Log in</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
