# Booking Borellia — Deployment Kılavuzu

Bu kılavuz, uygulamayı yerel makineden bağımsız hâle getirip buluta (Railway) taşımak için gereken adımları açıklar.

---

## Genel Mimari

```
[Android APK]  ──HTTP──▶  [Railway Backend]  ──▶  [Railway PostgreSQL]
```

- **Mobil uygulama:** EAS Build ile üretilen APK, herhangi bir Android cihaza kurulur.
- **Backend:** Railway bulutunda çalışır, internetten erişilebilir.
- **Veritabanı:** Railway'in sağladığı bulut PostgreSQL.

---

## 1. Railway Hesabı ve Proje Oluştur

1. [railway.app](https://railway.app) adresine git, GitHub hesabınla giriş yap.
2. **New Project** → **Deploy from GitHub repo** → `ulysn/hotel-booking-borelia` seç.
3. Railway otomatik olarak repoyu import eder.

---

## 2. Backend Servisini Yapılandır

Railway'in arayüzünde, backend servisinin **Settings** sekmesine gir:

| Ayar | Değer |
|------|-------|
| **Root Directory** | `booking-backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run db:deploy && npm start` |

> Railway `railway.toml` dosyasını da otomatik okur — bu ayarlar zaten orada tanımlı.

---

## 3. PostgreSQL Veritabanı Ekle

1. Projede **+ New** → **Database** → **PostgreSQL** seç.
2. Railway, `DATABASE_URL` environment variable'ını backend servisine **otomatik** bağlar.

---

## 4. Environment Variables Ekle

Backend servisinin **Variables** sekmesine gidip şu değişkeni elle ekle:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | Güçlü rastgele bir string (ör. `openssl rand -base64 32` çıktısı) |

> `DATABASE_URL` Railway tarafından otomatik eklenir, elle girme.

---

## 5. Seed Verisi Yükle (Oteller)

Deploy tamamlandıktan sonra Railway'in **Terminal** (Shell) sekmesini aç ve çalıştır:

```bash
npm run db:seed
```

Bu komut 6 otel ve 21 odayı veritabanına ekler.

---

## 6. Backend URL'ini Al

Railway'de backend servisinin **Settings → Networking → Public Domain** kısmından URL'ini kopyala.

Örnek: `https://booking-backend-production-xxxx.up.railway.app`

---

## 7. Mobil Uygulamayı Güncelle

`src/api/config.js` dosyasını aç ve `API_URL`'yi Railway URL'inle güncelle:

```js
// Önceki (yerel ağ):
export const API_URL = 'http://10.199.170.19:5000/api';

// Sonraki (bulut):
export const API_URL = 'https://booking-backend-production-xxxx.up.railway.app/api';
```

Değişikliği kaydet ve GitHub'a push et:

```bash
git add src/api/config.js
git commit -m "config: Railway backend URL'i güncellendi"
git push origin master
```

---

## 8. Yeni APK Build Al

```bash
cd booking-mobile   # proje kök dizini
EXPO_TOKEN=<token>  npx eas-cli build --platform android --profile preview --non-interactive
```

Build bittikten sonra EAS'ın verdiği APK linkini indir ve cihaza yükle.

---

## Yerel Geliştirme (Hızlı Başlangıç)

```bash
# Backend
cd booking-backend
cp .env.example .env        # DATABASE_URL ve JWT_SECRET doldur
npm install
npm run db:migrate          # Migrationları uygula
npm run db:seed             # Örnek veri ekle
npm run dev                 # http://localhost:5000

# Mobil (ayrı terminal)
cd ..
npm install
npm start                   # Expo Go ile test et
```

---

## Ortam Değişkenleri Özeti

| Değişken | Açıklama | Nerede Set Edilir |
|----------|----------|------------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | Railway otomatik / yerel `.env` |
| `JWT_SECRET` | JWT imzalama anahtarı | Railway Variables / yerel `.env` |
| `PORT` | Sunucu portu (opsiyonel) | Railway otomatik (5000) |

---

## Kontrol Listesi

- [ ] Railway projesi oluşturuldu
- [ ] Root Directory = `booking-backend` ayarlandı
- [ ] PostgreSQL servisi eklendi
- [ ] `JWT_SECRET` variable eklendi
- [ ] İlk deploy tamamlandı (yeşil ✓)
- [ ] `npm run db:seed` çalıştırıldı
- [ ] `src/api/config.js` Railway URL'i ile güncellendi
- [ ] GitHub'a push edildi
- [ ] Yeni EAS APK alındı
- [ ] APK cihaza kuruldu ve test edildi
