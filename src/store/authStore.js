import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'bb_token';
const USER_KEY  = 'bb_user';

const useAuthStore = create((set) => ({
  token: null,
  user:  null,
  isHydrating: true,

  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const userRaw = await AsyncStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    set({ token, user, isHydrating: false });
  },

  login: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
