# QABrains E-Commerce Test Automation

Automated End-to-End (E2E) testing untuk [QA Brains Practice E-Commerce](https://practice.qabrains.com/ecommerce) menggunakan Playwright TypeScript dengan arsitektur Page Object Model (POM).

## Instalasi & Eksekusi

```bash
npm install
npx playwright install
npx playwright test
```

## Struktur Page Object Model (POM)
- `pages/`: Logika tiap halaman (Auth, Inventory, Cart, Checkout, dll)
- `components/`: Elemen global (Header)
- `tests/`: Skrip test (Total 42 Test Cases)
- `lib/base.ts`: Playwright test fixture

## Skenario Uji (Positive & Negative Cases)

### 1. Authentication
- ✅ **[Positive]** Login berhasil dengan kredensial `test@qabrains.com` dan `Password123`.
- ❌ **[Negative]** Muncul pesan error "Neither email nor password matched" jika kredensial salah.
- ❌ **[Negative]** Form tertahan di halaman login jika field email/password kosong saat disubmit.

### 2. Inventory & Navigation
- ✅ **[Positive]** Semua produk termuat lengkap beserta nama dan harga.
- ✅ **[Positive]** Fungsi sortir bekerja (A-Z, Z-A, Price Low-High, Price High-Low).
- ✅ **[Positive]** Logout berhasil dan membersihkan state navigasi.
- ❌ **[Negative]** Mengakses *protected route* (seperti `/ecommerce/cart`) setelah logout akan otomatis mengembalikan user ke halaman login.

### 3. Cart & Modal Handling
- ✅ **[Positive]** Badge angka pada *header cart* sesuai dengan aksi tambah item.
- ✅ **[Positive]** Fungsi tambah (`+`) dan kurang (`-`) kuantitas item berjalan.
- ❌ **[Negative]** Aksi "Remove" di keranjang memunculkan *Modal/Dialog Confirmation* dan item tidak langsung terhapus jika belum menekan konfirmasi "Remove" di dalam popup.
- ❌ **[Negative]** State tombol checkout mati (*disabled*) saat isi keranjang kosong.

### 4. Checkout Flow
- ✅ **[Positive]** Proses checkout berlanjut lancar dari *Cart* > *Info* > *Overview* > *Complete*.
- ✅ **[Positive]** Kalkulasi total (*Item Total* + *Tax* = *Total Harga*) divalidasi akurat secara matematis.
- ❌ **[Negative]** Input field *Email* di halaman Checkout Info dalam keadaan *disabled* dan terkunci ke email pengguna yang login (tidak bisa dimanipulasi).
- ❌ **[Negative]** Penekanan tombol *Cancel* di tahapan checkout menginterupsi alur dan membuang user kembali ke keranjang/inventory.

### 5. Favorites
- ✅ **[Positive]** Navigasi ke halaman Favorites lewat menu profil berhasil.
- ❌ **[Negative]** Muncul pesan validasi "*You have no favorite products*" ketika halaman diakses dalam kondisi kosong.