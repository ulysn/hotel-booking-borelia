import './global.css';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import useAuthStore from './src/store/authStore';
import LoginScreen      from './src/screens/LoginScreen';
import SignUpScreen     from './src/screens/SignUpScreen';
import HomeScreen       from './src/screens/HomeScreen';
import HotelDetailScreen from './src/screens/HotelDetailScreen';
import PaymentScreen    from './src/screens/PaymentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { hydrate, user } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home"        component={HomeScreen} />
            <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
            <Stack.Screen name="Payment"     component={PaymentScreen} />
            <Stack.Screen name="Login"       component={LoginScreen} />
            <Stack.Screen name="SignUp"      component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"       component={LoginScreen} />
            <Stack.Screen name="SignUp"      component={SignUpScreen} />
            <Stack.Screen name="Home"        component={HomeScreen} />
            <Stack.Screen name="HotelDetail" component={HotelDetailScreen} />
            <Stack.Screen name="Payment"     component={PaymentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
