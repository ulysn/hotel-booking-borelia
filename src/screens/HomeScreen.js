import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, Image,
} from 'react-native';
import api from '../api/axiosClient';
import useAuthStore from '../store/authStore';

function HotelCard({ hotel, onPress }) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: `https://picsum.photos/seed/hotel-${hotel.id}/400/200` }}
        className="w-full h-36"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-bold text-[#111B4E] text-sm leading-snug" numberOfLines={2}>
          {hotel.name}
        </Text>
        <Text className="text-gray-500 text-xs mt-0.5">📍 {hotel.location}</Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-yellow-500 text-xs">{'★'.repeat(Math.floor(hotel.starRating ?? 0))} {hotel.starRating}</Text>
          <Text className="text-[#111B4E] font-bold text-sm">
            ${Math.min(...(hotel.rooms?.map(r => r.pricePerNight) ?? [0]))}<Text className="text-gray-400 font-normal text-xs">/night</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuthStore();
  const [hotels, setHotels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/hotels')
      .then(({ data }) => setHotels(data.hotels))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = hotels.filter((h) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q);
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#111B4E] pt-14 pb-5 px-5">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-xl font-bold">🪷 Booking Borellia</Text>
            {user && (
              <Text className="text-blue-200 text-xs mt-0.5">Merhaba, {user.firstName}!</Text>
            )}
          </View>
          {user ? (
            <TouchableOpacity
              className="bg-red-500 rounded-full px-4 py-2"
              onPress={async () => { await logout(); }}
            >
              <Text className="text-white text-xs font-semibold">Çıkış</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-white/20 rounded-full px-4 py-2"
              onPress={() => navigation.navigate('Login')}
            >
              <Text className="text-white text-xs font-semibold">Giriş Yap</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Arama kutusu */}
        <View className="bg-white rounded-full flex-row items-center px-4 py-2.5">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-sm text-gray-700"
            placeholder="Otel veya şehir ara..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Otel listesi */}
      <View className="flex-1 px-4 pt-4">
        <Text className="font-bold text-[#111B4E] text-sm italic mb-3">
          {search ? `"${search}" sonuçları` : 'Öne Çıkan Oteller:'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#111B4E" className="mt-8" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <HotelCard hotel={item} onPress={() => navigation.navigate('HotelDetail', { hotel: item })} />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center mt-12">
                <Text className="text-gray-400 text-base">Otel bulunamadı.</Text>
                <Text className="text-gray-300 text-sm mt-1">Backend'e otel verisi eklenince görünecek.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}
