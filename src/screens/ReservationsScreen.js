import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/axiosClient';

const STATUS_STYLE = {
  CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Onaylı' },
  PENDING:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Bekliyor' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-600', label: 'İptal' },
};

function ReservationCard({ item }) {
  const s = STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
  const checkIn  = new Date(item.checkInDate).toLocaleDateString('tr-TR');
  const checkOut = new Date(item.checkOutDate).toLocaleDateString('tr-TR');
  const nights   = Math.max(1, Math.ceil(
    (new Date(item.checkOutDate) - new Date(item.checkInDate)) / 86400000
  ));

  return (
    <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-bold text-[#111B4E] text-sm flex-1 pr-2" numberOfLines={2}>
          {item.room?.hotel?.name ?? 'Otel'}
        </Text>
        <View className={`px-2 py-0.5 rounded-full ${s.bg}`}>
          <Text className={`text-xs font-semibold ${s.text}`}>{s.label}</Text>
        </View>
      </View>

      <Text className="text-gray-500 text-xs mb-1">📍 {item.room?.hotel?.location}</Text>
      <Text className="text-gray-600 text-xs mb-1">🛏 {item.room?.type}</Text>
      <Text className="text-gray-600 text-xs">
        📅 {checkIn} → {checkOut} · {nights} gece
      </Text>

      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <Text className="text-gray-400 text-xs">
          #{String(item.id).padStart(4, '0')}
        </Text>
        <Text className="font-bold text-[#111B4E] text-base">
          ${item.totalPrice}
          <Text className="font-normal text-gray-400 text-xs"> toplam</Text>
        </Text>
      </View>
    </View>
  );
}

export default function ReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const fetchReservations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const { data } = await api.get('/reservations/me');
      setReservations(data.reservations);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#111B4E] px-5 pb-4 pt-2 flex-row items-center gap-3">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Rezervasyonlarım</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#111B4E" />
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ReservationCard item={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchReservations(true)}
              colors={['#111B4E']}
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-5xl mb-3">🪷</Text>
              <Text className="text-gray-500 text-base font-semibold">Henüz rezervasyonunuz yok</Text>
              <TouchableOpacity
                className="mt-4 bg-[#111B4E] rounded-full px-6 py-2.5"
                onPress={() => navigation.navigate('Home')}
              >
                <Text className="text-white text-sm font-semibold">Otel Ara</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
