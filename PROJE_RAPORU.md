# Booking Borellia — Proje Geliştirme Raporu

**Son Güncelleme:** 27 Mayıs 2026  
**Proje Dizinleri:**
- Web: `C:\Users\msi\booking-borellia`
- Mobil: `C:\Users\msi\booking-mobile`

**Durum:** Web ✅ Tamamlandı | Mobil 🔄 APK Build Devam Ediyor

---

## 1. Proje Özeti

Booking Borellia, otel arama ve rezervasyon işlemlerini kapsayan tam yığın (full-stack) bir platformdur. Üç katmandan oluşur:

1. **Web Frontend** — React + Vite + Tailwind CSS (masaüstü/mobil tarayıcı)
2. **Backend API** — Node.js + Express + TypeScript + PostgreSQL
3. **Mobil Uygulama** — React Native + Expo (.apk / .ipa)

Tüm katmanlar aynı backend API'yi kullanır. Figma tasarımları esas alınarak mobil öncelikli geliştirildi.

---

## 2. Teknoloji Yığını

### Web Frontend
| Teknoloji | Versiyon | Amaç |
|---|---|---|
| React | 19.2.6 | UI framework |
| Vite | 8.0.12 | Build tool / dev server |
| Tailwind CSS | 3.4.19 | Utility-first CSS |
| react-router-dom | 7.15.1 | Sayfa yönlendirme |
| axios | 1.16.1 | HTTP istekleri |
| zustand | 5.0.13 | Auth state yönetimi |
| lucide-react | 1.16.0 | İkon kütüphanesi |
| react-icons | 5.6.0 | Sosyal medya ikonları |

### Backend
| Teknoloji | Versiyon | Amaç |
|---|---|---|
| Node.js | 24.4.1 | Runtime |
| Express | 5.2.1 | HTTP framework |
| TypeScript | 6.0.3 | Tip güvenliği |
| Prisma ORM | 7.8.0 | Veritabanı ORM |
| @prisma/adapter-pg | 7.8.0 | PostgreSQL adapter |
| PostgreSQL (pg) | 8.21.0 | Veritabanı sürücüsü |
| bcrypt | 6.0.0 | Şifre hash'leme |
| jsonwebtoken | 9.0.3 | JWT kimlik doğrulama |
| zod | 4.4.3 | Şema validasyonu |
| cors | 2.8.6 | Cross-origin desteği |
| dotenv | 17.4.2 | Ortam değişkenleri |
| nodemon + ts-node | — | Geliştirme sunucusu |

### Mobil Uygulama
| Teknoloji | Versiyon | Amaç |
|---|---|---|
| React Native | — | Mobil UI framework |
| Expo SDK | 56.0.5 | Mobil geliştirme platformu |
| NativeWind | 4.2.4 | Tailwind CSS (React Native için) |
| @react-navigation/native | — | Ekran yönlendirme |
| @react-navigation/native-stack | — | Stack navigator |
| axios | — | HTTP istekleri |
| zustand | — | Auth state yönetimi |
| @react-native-async-storage/async-storage | — | JWT token kalıcı depolama |
| EAS CLI | 19.1.0 | Bulut APK/IPA derleme |

---

## 3. Proje Dizin Yapısı

### 3.1 Web + Backend (`booking-borellia/`)

```
booking-borellia/
│
├── src/                          ← Web frontend kaynak kodu
│   ├── App.jsx                   ← Router tanımları
│   ├── main.jsx                  ← React giriş noktası
│   ├── index.css                 ← Global stiller + Tailwind katmanları
│   ├── api/
│   │   └── axiosClient.js        ← Axios instance + JWT interceptor
│   ├── store/
│   │   └── authStore.js          ← Zustand auth store (localStorage)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LogoHeader.jsx
│   │   ├── SearchForm.jsx
│   │   ├── HotelCard.jsx
│   │   ├── InputField.jsx
│   │   ├── PrimaryButton.jsx
│   │   └── FacilityIcon.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── LoginPage.jsx
│       ├── SignUpPage.jsx
│       ├── HotelListingPage.jsx
│       ├── HotelDetailPage.jsx
│       └── PaymentPage.jsx
│
├── booking-backend/              ← Backend kaynak kodu
│   ├── src/
│   │   ├── index.ts              ← Express sunucu (port 5000)
│   │   ├── lib/prisma.ts         ← Prisma client (PrismaPg adapter)
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts ← JWT doğrulama
│   │   └── routes/
│   │       ├── auth.ts           ← /register, /login
│   │       ├── hotels.ts         ← GET /hotels, GET /hotels/:id
│   │       └── reservations.ts   ← POST + GET /reservations
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/20260526192432_init/migration.sql
│
├── figma-tasarimlar/             ← Referans Figma görselleri (6 adet)
├── screenshots/                  ← Ekran görüntüleri (6 adet)
└── PROJE_RAPORU.md
```

### 3.2 Mobil Uygulama (`booking-mobile/`)

```
booking-mobile/
│
├── App.js                        ← NavigationContainer + Stack.Navigator
├── global.css                    ← Tailwind direktifleri
├── babel.config.js               ← NativeWind v4 babel preset
├── metro.config.js               ← withNativeWind metro wrapper
├── tailwind.config.js            ← nativewind/preset + özel renkler
├── eas.json                      ← EAS build profilleri (preview=APK, production=AAB)
├── app.json                      ← Expo yapılandırması, paket adı, EAS proje ID
│
└── src/
    ├── api/
    │   └── axiosClient.js        ← axios (baseURL: 10.199.170.19:5000) + AsyncStorage interceptor
    ├── store/
    │   └── authStore.js          ← Zustand + AsyncStorage (hydrate() ile uygulama açılışında yükleme)
    └── screens/
        ├── LoginScreen.js        ← Giriş ekranı
        ├── SignUpScreen.js       ← Kayıt ekranı
        ├── HomeScreen.js         ← Otel listesi + arama
        ├── HotelDetailScreen.js  ← Otel detay + oda seçimi
        └── PaymentScreen.js      ← Ödeme + rezervasyon onayı
```

---

## 4. Veritabanı Şeması

### 4.1 Enum Tipleri

```sql
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
```

### 4.2 Tablolar

**User**
| Sütun | Tip | Açıklama |
|---|---|---|
| id | SERIAL PK | Otomatik artan kimlik |
| firstName | TEXT | Ad |
| lastName | TEXT | Soyad |
| email | TEXT UNIQUE | E-posta (benzersiz) |
| phone | TEXT nullable | Telefon |
| password | TEXT | bcrypt hash'lenmiş şifre |
| role | Role | CUSTOMER veya ADMIN (default: CUSTOMER) |
| createdAt | TIMESTAMP | Kayıt tarihi |

**Hotel**
| Sütun | Tip | Açıklama |
|---|---|---|
| id | SERIAL PK | Otomatik artan kimlik |
| name | TEXT | Otel adı |
| location | TEXT | Konum |
| description | TEXT nullable | Açıklama |
| starRating | FLOAT | Yıldız puanı |

**Room**
| Sütun | Tip | Açıklama |
|---|---|---|
| id | SERIAL PK | Otomatik artan kimlik |
| hotelId | INT FK | Hotel.id referansı |
| type | TEXT | Oda tipi (Standart, Deluxe, vb.) |
| pricePerNight | FLOAT | Geceleme fiyatı |
| isAvailable | BOOLEAN | Müsaitlik durumu (default: true) |
| capacity | INT | Kapasite |

**Reservation**
| Sütun | Tip | Açıklama |
|---|---|---|
| id | SERIAL PK | Otomatik artan kimlik |
| userId | INT FK | User.id referansı |
| roomId | INT FK | Room.id referansı |
| checkInDate | TIMESTAMP | Giriş tarihi |
| checkOutDate | TIMESTAMP | Çıkış tarihi |
| totalPrice | FLOAT | Toplam tutar (gece × fiyat) |
| status | ReservationStatus | PENDING / CONFIRMED / CANCELLED |
| createdAt | TIMESTAMP | Oluşturma tarihi |

---

## 5. API Uç Noktaları

### Kimlik Doğrulama (`/api/auth`)
| Metot | Uç Nokta | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | Hayır |
| POST | `/api/auth/login` | Giriş → JWT token (7 gün) | Hayır |

### Oteller (`/api/hotels`)
| Metot | Uç Nokta | Açıklama | Auth |
|---|---|---|---|
| GET | `/api/hotels` | Tüm oteller + oda sayısı | Hayır |
| GET | `/api/hotels/:id` | Tek otel + odalar | Hayır |

### Rezervasyonlar (`/api/reservations`)
| Metot | Uç Nokta | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/reservations` | Rezervasyon oluştur (çakışma kontrolü ile) | Evet |
| GET | `/api/reservations/me` | Kullanıcının rezervasyonları | Evet |

### Diğer
| Metot | Uç Nokta | Açıklama |
|---|---|---|
| GET | `/health` | Sunucu sağlık kontrolü |

---

## 6. Web Frontend — Sayfa Detayları

| Rota | Bileşen | Açıklama |
|---|---|---|
| `/` | HomePage | Arama formu + öne çıkan 6 otel (2-kolon grid) |
| `/login` | LoginPage | İki satırlı Figma başlığı, JWT giriş |
| `/signup` | SignUpPage | Tek sütun form, Zod alan hataları |
| `/hotels` | HotelListingPage | Liste görünümü, rating sıralaması |
| `/hotels/:id` | HotelDetailPage | Galeri, oda seçimi, sticky fiyat barı |
| `/payment` | PaymentPage | Kart formatlaması, rezervasyon API, onay ekranı |

---

## 7. Mobil Uygulama — Ekran Detayları

| Ekran | Dosya | Açıklama |
|---|---|---|
| Login | `LoginScreen.js` | Expo hesabı + backend entegrasyonu, Alert ile hata |
| Sign Up | `SignUpScreen.js` | Zod alan hataları, kayıt sonrası Login'e yönlendirme |
| Home | `HomeScreen.js` | FlatList ile otel kartları, canlı metin filtresi, çıkış butonu |
| Hotel Detail | `HotelDetailScreen.js` | Thumbnail carousel, seçilebilir oda listesi, sticky "Book Room" |
| Payment | `PaymentScreen.js` | Kart formatlaması, AsyncStorage token ile POST /reservations, onay ekranı |

### 7.1 Web ↔ Mobil Temel Farklar

| Konu | Web | Mobil |
|---|---|---|
| Token depolama | `localStorage` | `AsyncStorage` (async/await) |
| Token yükleme | Senkron (uygulama başlangıcı) | `hydrate()` ile async yükleme |
| Backend URL | `localhost:5000` | `10.199.170.19:5000` (yerel IP) |
| Navigasyon | `react-router-dom` | `@react-navigation/native-stack` |
| Stil | Tailwind (web) | NativeWind v4 (React Native) |
| CSS yapılandırması | `index.css` | `global.css` + `metro.config.js` |

---

## 8. Tasarım Sistemi

### Özel Renkler (her iki platformda ortak)
```js
navy:  { DEFAULT: '#1B2765', dark: '#111B4E', light: '#2a4f80' }
leaf:  { DEFAULT: '#2d9b5e', light: '#52c78a', dark: '#1a5c38' }
lotus: '#1B6B5C'
```

### Lotus SVG İkonu
- Üç katmanlı SVG, her sayfada tekrar eden marka öğesi
- Dış yaprak: `#1B6B5C` / Orta: `#2D9B5E` / İç: `#52C78A`
- Web: inline SVG bileşeni | Mobil: emoji 🪷 (React Native SVG desteği gerektirmez)

---

## 9. Karşılaşılan Sorunlar ve Çözümler

### Prisma 7 Uyumluluk
- `schema.prisma`'da `url = env(...)` desteklenmiyor → `prisma.config.ts`'e taşındı
- `PrismaClient` doğrudan URL almıyor → `@prisma/adapter-pg` ile `PrismaPg` adapter kullanıldı
- `'../generated/prisma'` dizin import'u çalışmıyor → `'../generated/prisma/client'` tam yolu kullanıldı

### TypeScript Tip Sorunu
- `req.params.id` tipi `string | string[]` → `req.params['id'] as string` ile çözüldü

### NativeWind v4 + Expo SDK 56
- `babel-preset-expo` expo içine nested, doğrudan erişilemiyor → top-level `npm install --save-dev babel-preset-expo` ile çözüldü
- Android bundle başarı testi: `npx expo export --platform android` → 3.2 MB, sıfır hata

### EAS Build Kurulumu
- `app.json`'daki `extra.eas.projectId` string değil UUID gerektiriyor → `eas project:init --force` ile gerçek UUID alındı (`39902c0d-fbd0-49a1-a30a-cee089b4445c`)
- EAS CLI session farklı shell'de saklanıyor → `EXPO_TOKEN` env değişkeniyle kimlik doğrulama yapıldı

---

## 10. Çalıştırma Komutları

### Backend
```bash
cd C:\Users\msi\booking-borellia\booking-backend
npm run dev          # http://localhost:5000
npm run db:migrate   # Veritabanı tablolarını oluştur
```

### Web Frontend
```bash
cd C:\Users\msi\booking-borellia
npm run dev          # http://localhost:5173
npm run build        # dist/ klasörüne production build
```

### Mobil (Geliştirme)
```bash
cd C:\Users\msi\booking-mobile
npx expo start       # QR kod → Expo Go uygulaması
npx expo start --android  # Android emülatör
```

### Mobil (APK Build)
```bash
cd C:\Users\msi\booking-mobile
EXPO_TOKEN=<token> npx eas-cli build --platform android --profile preview
# Build takip: https://expo.dev/accounts/elifbilge/projects/booking-borellia/builds
```

---

## 11. Geliştirme Aşamaları

| Aşama | Kapsam | Durum |
|---|---|---|
| **Faz 1** | React web frontend — 6 sayfa, 8 bileşen | ✅ Tamamlandı |
| **Faz 2** | Node.js backend — Express + TypeScript + Prisma + PostgreSQL | ✅ Tamamlandı |
| **Faz 3** | Web frontend–backend entegrasyonu | ✅ Tamamlandı |
| **Faz 4** | Figma tasarımlarına uyum | ✅ Tamamlandı |
| **Faz 5** | React Native Expo mobil uygulama | ✅ Tamamlandı |
| **Faz 6** | EAS Build — Android APK çıktısı | ✅ Tamamlandı |

---

## 12. Build Sonuçları

### Web Production Build
```
dist/index.html                   0.78 kB │ gzip:  0.42 kB
dist/assets/index.css            24.53 kB │ gzip:  5.11 kB
dist/assets/index.js            324.31 kB │ gzip: 103.52 kB
✓ built in 547ms — sıfır hata
```

### Mobil Export Testi
```
android bundle: index-e34eaaca.hbc   3.2 MB
✓ exported — sıfır hata
```

### EAS APK Build
```
Build ID:    50c80657-21ac-48dd-a363-8e99cd6ec0f8
Platform:    Android
Profile:     preview (buildType: apk)
SDK:         56.0.0
Başladı:     27.05.2026 12:51
Tamamlandı:  27.05.2026 13:13  (22 dakika)
Durum:       ✅ finished
APK:         https://expo.dev/artifacts/eas/aYyE7MfmvHoJk9RXMnbt55.apk
Loglar:      https://expo.dev/accounts/elifbilge/projects/booking-borellia/builds/50c80657-21ac-48dd-a363-8e99cd6ec0f8
```

---

## 13. Sunucu Durumu

| Servis | URL | Durum |
|---|---|---|
| Web Frontend (dev) | http://localhost:5174 | ✅ Çalışıyor |
| Backend API | http://localhost:5000/api | ✅ Çalışıyor |
| Health Check | http://localhost:5000/health | ✅ `{ "status": "ok" }` |
| Expo Build Dashboard | https://expo.dev/accounts/elifbilge/projects/booking-borellia | 🔄 Build devam ediyor |

---

*Bu rapor 27 Mayıs 2026 tarihinde güncellenmiştir.*
