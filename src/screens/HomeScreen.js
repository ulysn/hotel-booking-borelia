import { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, Image, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../api/axiosClient';
import useAuthStore from '../store/authStore';

const SORT_OPTIONS = [
  { key: 'default',    label: 'Önerilen' },
  { key: 'price-asc',  label: 'Fiyat ↑' },
  { key: 'price-desc', label: 'Fiyat ↓' },
  { key: 'stars-desc', label: 'Yıldız ↓' },
];

const STAR_OPTIONS = [
  { key: 0, label: 'Tümü' },
  { key: 3, label: '3★+' },
  { key: 4, label: '4★+' },
  { key: 5, label: '5★' },
];

function HotelCard({ hotel, onPress }) {
  const minPrice = Math.min(...(hotel.rooms?.map(r => r.pricePerNight) ?? [0]));
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
          <Text className="text-yellow-500 text-xs">
            {'★'.repeat(Math.floor(hotel.starRating ?? 0))} {hotel.starRating}
          </Text>
          <Text className="text-[#111B4E] font-bold text-sm">
            ${minPrice}<Text className="text-gray-400 font-normal text-xs">/gece</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [hotels, setHotels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('default');
  const [minStars, setMinStars] = useState(0);

  useEffect(() => {
    api.get('/hotels')
      .then(({ data }) => setHotels(data.hotels))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return hotels
      .filter((h) => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q);
        const matchStars = h.starRating >= minStars;
        return matchSearch && matchStars;
      })
      .sort((a, b) => {
        const aMin = Math.min(...(a.rooms?.map(r => r.pricePerNight) ?? [0]));
        const bMin = Math.min(...(b.rooms?.map(r => r.pricePerNight) ?? [0]));
        if (sortBy === 'price-asc')  return aMin - bMin;
        if (sortBy === 'price-desc') return bMin - aMin;
        if (sortBy === 'stars-desc') return b.starRating - a.starRating;
        return a.id - b.id;
      });
  }, [hotels, search, sortBy, minStars]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#111B4E] pb-3 px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-white text-xl font-bold">🪷 Booking Borellia</Text>
            {user && (
              <Text className="text-blue-200 text-xs mt-0.5">Merhaba, {user.firstName}!</Text>
            )}
          </View>
          <View className="flex-row gap-2">
            {user ? (
              <>
                <TouchableOpacity
                  className="bg-white/20 rounded-full px-3 py-2"
                  onPress={() => navigation.navigate('Reservations')}
                >
                  <Text className="text-white text-xs font-semibold">📋 Rezervasyonlar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 rounded-full px-3 py-2"
                  onPress={async () => { await logout(); }}
                >
                  <Text className="text-white text-xs font-semibold">Çıkış</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                className="bg-white/20 rounded-full px-4 py-2"
                onPress={() => navigation.navigate('Login')}
              >
                <Text className="text-white text-xs font-semibold">Giriş Yap</Text>
              </TouchableOpacity>
            )}
          </View>
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
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-gray-400 text-base ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtre çubukları */}
      <View className="bg-white border-b border-gray-100 px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1.5">
          <View className="flex-row gap-2">
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-full border ${
                  sortBy === opt.key
                    ? 'bg-[#111B4E] border-[#111B4E]'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-xs font-semibold ${
                  sortBy === opt.key ? 'text-white' : 'text-gray-600'
                }`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {STAR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setMinStars(opt.key)}
                className={`px-3 py-1.5 rounded-full border ${
                  minStars === opt.key
                    ? 'bg-yellow-400 border-yellow-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-xs font-semibold ${
                  minStars === opt.key ? 'text-white' : 'text-gray-600'
                }`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Otel listesi */}
      <View className="flex-1 px-4 pt-3">
        <Text className="font-bold text-[#111B4E] text-sm italic mb-3">
          {search
            ? `"${search}" — ${filtered.length} sonuç`
            : `${filtered.length} otel listeleniyor`}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#111B4E" className="mt-8" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <HotelCard
                hotel={item}
                onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center mt-12">
                <Text className="text-gray-400 text-base">Otel bulunamadı.</Text>
                <Text className="text-gray-300 text-sm mt-1">Filtre veya arama kriterlerini değiştirin.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}
