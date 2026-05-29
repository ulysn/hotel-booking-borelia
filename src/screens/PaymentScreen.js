import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import api from '../api/axiosClient';
import useAuthStore from '../store/authStore';

export default function PaymentScreen({ navigation, route }) {
  const { hotel, room } = route.params ?? {};
  const { user } = useAuthStore();

  const _today    = new Date();
  const _tomorrow = new Date(_today);
  _tomorrow.setDate(_today.getDate() + 1);
  const _fmt = (d) => d.toISOString().split('T')[0];

  const [checkIn,  setCheckIn]  = useState(_fmt(_today));
  const [checkOut, setCheckOut] = useState(_fmt(_tomorrow));
  const guests = 2;

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const pricePerNight = room?.pricePerNight ?? 450;
  const totalPrice    = nights * pricePerNight;

  const [contact, setContact] = useState({
    name: user?.firstName || '', surname: user?.lastName || '',
    email: user?.email || '', phone: '',
  });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [loading, setLoading]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [apiError, setApiError] = useState('');

  const setC = (f) => (v) => setContact({ ...contact, [f]: v });
  const setP = (f) => (v) => setPayment({ ...payment, [f]: v });

  const formatCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const c = v.replace(/\D/g, '').slice(0, 4);
    return c.length >= 3 ? `${c.slice(0, 2)}/${c.slice(2)}` : c;
  };

  const handleSubmit = async () => {
    if (!user) { Alert.alert('Giriş Gerekli', 'Rezervasyon için giriş yapmalısınız.'); return; }
    if (!room)  { setApiError('Oda seçilmedi.'); return; }
    setLoading(true); setApiError('');
    try {
      const { data } = await api.post('/reservations', {
        roomId: room.id,
        checkInDate:  new Date(checkIn).toISOString(),
        checkOutDate: new Date(checkOut).toISOString(),
      });
      setReservation(data.reservation);
      setConfirmed(true);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Rezervasyon oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      <Text className="text-5xl mb-4">✅</Text>
      <Text className="font-bold text-2xl text-[#111B4E] mb-2">Reservation Confirmed!</Text>
      <Text className="text-gray-500 text-center mb-1">
        Your stay at <Text className="font-semibold">{reservation?.room?.hotel?.name || hotel?.name}</Text> is booked.
      </Text>
      <Text className="text-gray-400 text-sm mb-4">{checkIn} — {checkOut} · {guests} Guests</Text>
      <Text className="text-3xl font-bold text-[#111B4E] mb-6">
        ${reservation?.totalPrice ?? totalPrice} <Text className="text-gray-400 text-base font-normal">total</Text>
      </Text>
      <TouchableOpacity
        className="bg-[#111B4E] rounded-full px-8 py-3"
        onPress={() => navigation.navigate('Home')}
      >
        <Text className="text-white font-semibold">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View className="bg-white flex-row items-center px-4 pt-14 pb-4 border-b border-gray-100">
          <TouchableOpacity
            className="w-9 h-9 rounded-full border border-gray-300 items-center justify-center mr-3"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-gray-600">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center border-2 border-[#2d9b5e] rounded-2xl px-4 py-2 gap-2">
            <Text>🌿</Text>
            <Text className="text-2xl">🪷</Text>
            <Text>🌿</Text>
            <Text className="font-bold text-[#111B4E] text-xs leading-tight">Reservation{'\n'}Confirmation</Text>
          </View>
        </View>

        <View className="px-4 py-5 space-y-5">

          {/* Rezervasyon özeti */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="font-bold text-[#111B4E] text-sm mb-1" numberOfLines={2}>
              {hotel?.name || 'Otel Adı'}
            </Text>
            <Text className="text-gray-500 text-xs mb-1">📍 {hotel?.location}</Text>
            <Text className="text-gray-600 text-xs">
              {checkIn} — {checkOut} · {nights} night · {guests} Guests
            </Text>
            <Text className="font-bold text-[#111B4E] text-sm mt-1">${totalPrice} total</Text>
          </View>

          {apiError ? (
            <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <Text className="text-red-600 text-sm">{apiError}</Text>
            </View>
          ) : null}

          {!user && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
              <Text className="text-yellow-700 text-sm">
                Rezervasyon için{' '}
                <Text className="font-semibold underline" onPress={() => navigation.navigate('Login')}>
                  giriş yapın
                </Text>
                .
              </Text>
            </View>
          )}

          {/* İletişim bilgileri */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="font-semibold text-[#111B4E] text-sm mb-3">Who will handle the login process?</Text>
            {[
              { key: 'name',    label: 'Name *',         type: 'default' },
              { key: 'surname', label: 'Surname *',      type: 'default' },
              { key: 'email',   label: 'Email *',        type: 'email-address' },
              { key: 'phone',   label: 'Phone Number *', type: 'phone-pad' },
            ].map(({ key, label, type }) => (
              <TextInput key={key}
                className="bg-gray-100 rounded-2xl px-4 py-3 mb-2 text-sm text-gray-700"
                placeholder={label}
                value={contact[key]}
                onChangeText={setC(key)}
                keyboardType={type}
                autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                placeholderTextColor="#9ca3af"
              />
            ))}
          </View>

          {/* Ödeme bilgileri */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Text className="font-semibold text-[#111B4E] text-sm mb-1">Payment Information</Text>
            <Text className="text-xs text-gray-400 mb-3">💳 Secure transactions. Your info is protected.</Text>

            {/* Kart logoları */}
            <View className="flex-row gap-2 mb-4">
              <View className="flex-row">
                <View className="w-5 h-5 bg-red-500 rounded-full opacity-90" />
                <View className="w-5 h-5 bg-yellow-400 rounded-full -ml-2.5 opacity-90" />
              </View>
              <View className="bg-blue-700 px-2 py-1 rounded">
                <Text className="text-white text-xs font-bold italic">VISA</Text>
              </View>
              <View className="bg-blue-400 px-2 py-1 rounded">
                <Text className="text-white text-xs font-bold">AMEX</Text>
              </View>
            </View>

            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-3 mb-2 text-sm text-gray-700"
              placeholder="Cardholder Name *"
              value={payment.cardName}
              onChangeText={setP('cardName')}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              className="bg-gray-100 rounded-2xl px-4 py-3 mb-2 text-sm text-gray-700 font-mono tracking-widest"
              placeholder="0000 0000 0000 0000"
              value={payment.cardNumber}
              onChangeText={(v) => setPayment({ ...payment, cardNumber: formatCard(v) })}
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor="#9ca3af"
            />
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 font-mono"
                placeholder="MM/YY"
                value={payment.expiry}
                onChangeText={(v) => setPayment({ ...payment, expiry: formatExpiry(v) })}
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 font-mono"
                placeholder="CVV"
                value={payment.cvv}
                onChangeText={(v) => setPayment({ ...payment, cvv: v.replace(/\D/g, '').slice(0, 4) })}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 flex-row justify-between items-center">
        <Text className="font-bold text-[#111B4E] text-xl">
          ${totalPrice}<Text className="text-gray-400 font-normal text-base">/total</Text>
        </Text>
        <TouchableOpacity
          className="bg-[#111B4E] rounded-full px-6 py-3"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold text-sm">Confirm Reservation</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}
