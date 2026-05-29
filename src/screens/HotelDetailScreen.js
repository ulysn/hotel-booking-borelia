import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import api from '../api/axiosClient';

export default function HotelDetailScreen({ navigation, route }) {
  const passedHotel = route.params?.hotel;
  const [hotel, setHotel]         = useState(passedHotel || null);
  const [loading, setLoading]     = useState(!passedHotel);
  const [selectedRoom, setRoom]   = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!passedHotel?.rooms) {
      api.get(`/hotels/${passedHotel?.id || route.params?.id}`)
        .then(({ data }) => {
          setHotel(data.hotel);
          if (data.hotel.rooms?.length) setRoom(data.hotel.rooms[0]);
        })
        .catch(() => Alert.alert('Hata', 'Otel bilgileri yüklenemedi.'))
        .finally(() => setLoading(false));
    } else {
      if (passedHotel.rooms?.length) setRoom(passedHotel.rooms[0]);
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#111B4E" />
    </View>
  );

  if (!hotel) return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-red-500 text-center">Otel bulunamadı.</Text>
    </View>
  );

  const images = [
    `https://picsum.photos/seed/hotel-${hotel.id}/800/400`,
    `https://picsum.photos/seed/hotel-${hotel.id}-a/400/200`,
    `https://picsum.photos/seed/hotel-${hotel.id}-b/400/200`,
    `https://picsum.photos/seed/hotel-${hotel.id}-c/400/200`,
  ];

  const minPrice = hotel.rooms?.length
    ? Math.min(...hotel.rooms.map((r) => r.pricePerNight))
    : null;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero görseli */}
        <View className="relative">
          <Image source={{ uri: images[activeImg] }} className="w-full h-56" resizeMode="cover" />
          <TouchableOpacity
            className="absolute top-12 left-4 bg-white/80 rounded-full w-9 h-9 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[#111B4E] font-bold text-base">←</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnail'lar */}
        <View className="flex-row gap-2 px-4 mt-3">
          {images.slice(1).map((img, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveImg(i + 1)}
              className={`flex-1 rounded-xl overflow-hidden border-2 ${activeImg === i + 1 ? 'border-[#111B4E]' : 'border-transparent'}`}>
              <Image source={{ uri: img }} className="w-full h-14" resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-4 pt-4 pb-28">
          {/* Başlık + konum */}
          <Text className="font-bold text-[#111B4E] text-xl leading-snug">{hotel.name}</Text>
          <Text className="text-gray-500 text-sm mt-1">📍 {hotel.location}</Text>

          {/* Yıldızlar */}
          <View className="flex-row items-center gap-1 mt-2">
            <Text className="text-yellow-400">{'★'.repeat(Math.floor(hotel.starRating ?? 0))}</Text>
            <Text className="text-gray-500 text-xs">{hotel.starRating} ({hotel._count?.rooms ?? 0} oda)</Text>
          </View>

          {/* Olanaklar */}
          <View className="flex-row gap-5 mt-4 mb-4">
            {[{ emoji: '📶', label: 'Wi-fi' }, { emoji: '🏊', label: 'Pool' }, { emoji: '🏥', label: 'Clinic' }].map(({ emoji, label }) => (
              <View key={label} className="items-center">
                <Text className="text-2xl">{emoji}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{label}</Text>
              </View>
            ))}
          </View>

          {/* Açıklama */}
          <Text className="font-semibold text-[#111B4E] text-sm underline mb-2">Information</Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            {hotel.description || 'A tranquil escape blending traditional elegance with modern comfort.'}
          </Text>

          {/* Odalar */}
          {hotel.rooms?.length > 0 && (
            <View className="mt-5">
              <Text className="font-semibold text-[#111B4E] text-sm mb-2">
                Available Rooms ({hotel.rooms.length})
              </Text>
              {hotel.rooms.map((room) => (
                <TouchableOpacity key={room.id} onPress={() => setRoom(room)}
                  className={`flex-row justify-between items-center p-3 rounded-2xl border mb-2 ${
                    selectedRoom?.id === room.id ? 'border-[#111B4E] bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <View>
                    <Text className="font-semibold text-[#111B4E] text-sm">{room.type}</Text>
                    <Text className="text-xs text-gray-500">{room.capacity} guests</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-[#111B4E]">${room.pricePerNight}<Text className="text-gray-400 font-normal text-xs">/night</Text></Text>
                    <View className={`mt-1 px-2 py-0.5 rounded-full ${room.isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Text className={`text-xs ${room.isAvailable ? 'text-green-700' : 'text-red-600'}`}>
                        {room.isAvailable ? 'Available' : 'Booked'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky alt bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-gray-400">Starting from</Text>
          <Text className="font-bold text-[#111B4E] text-xl">
            ${minPrice ?? 0}<Text className="text-gray-400 font-normal text-sm">/night</Text>
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#111B4E] rounded-full px-7 py-3"
          disabled={!selectedRoom || !selectedRoom.isAvailable}
          onPress={() => navigation.navigate('Payment', { hotel, room: selectedRoom })}
        >
          <Text className="text-white font-semibold">Book Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
