import './global.css';
import { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useAuthStore from './src/store/authStore';
import LoginScreen        from './src/screens/LoginScreen';
import SignUpScreen       from './src/screens/SignUpScreen';
import HomeScreen         from './src/screens/HomeScreen';
import HotelDetailScreen  from './src/screens/HotelDetailScreen';
import PaymentScreen      from './src/screens/PaymentScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { hydrate, user, isHydrating } = useAuthStore();

  useEffect(() => { hydrate(); }, []);

  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#111B4E' }} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Home"         component={HomeScreen} />
              <Stack.Screen name="HotelDetail"  component={HotelDetailScreen} />
              <Stack.Screen name="Payment"      component={PaymentScreen} />
              <Stack.Screen name="Reservations" component={ReservationsScreen} />
              <Stack.Screen name="Login"        component={LoginScreen} />
              <Stack.Screen name="SignUp"       component={SignUpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login"        component={LoginScreen} />
              <Stack.Screen name="SignUp"       component={SignUpScreen} />
              <Stack.Screen name="Home"         component={HomeScreen} />
              <Stack.Screen name="HotelDetail"  component={HotelDetailScreen} />
              <Stack.Screen name="Payment"      component={PaymentScreen} />
              <Stack.Screen name="Reservations" component={ReservationsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
