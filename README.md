# TypeScript Games Collection

Koleksi game sederhana yang dibuat dengan TypeScript untuk browser, termasuk:

1. **Tebak Angka** - Game menebak angka acak antara 1-100
2. **Tic-Tac-Toe** - Game klasik X dan O

## Fitur

### Game Tebak Angka

- Menebak angka acak antara 1-100
- Sistem petunjuk (terlalu besar/kecil)
- Tracking jumlah percobaan
- Penyimpanan skor terbaik di localStorage
- **Bot Helper Features:**
  - 💡 **Hint System** - Bot memberikan petunjuk berdasarkan jarak ke target
  - 🤖 **Auto Solve** - Bot menyelesaikan game menggunakan binary search
  - 📊 **Range Display** - Menampilkan range angka yang mungkin
- Interface yang user-friendly

### Game Tic-Tac-Toe

- Permainan klasik 3x3
- **Mode Permainan:**
  - 👥 **Player vs Player** - Dua pemain bergantian
  - 🤖 **Player vs Bot** - Melawan AI dengan 3 tingkat kesulitan
- **Bot AI Features:**
  - 🟢 **Easy** - Bot bermain secara acak
  - 🟡 **Medium** - Bot menggunakan strategi campuran (70% optimal, 30% acak)
  - 🔴 **Hard** - Bot menggunakan algoritma Minimax (tidak terkalahkan)
- Sistem giliran pemain
- Deteksi kemenangan otomatis
- Tracking skor (menang/seri)
- Penyimpanan skor di localStorage
- Reset skor

## Teknologi yang Digunakan

- **TypeScript** - Bahasa pemrograman utama
- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **LocalStorage** - Penyimpanan data lokal
- **Responsive Design** - Kompatibel dengan mobile

## Cara Menjalankan

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Instalasi dan Menjalankan

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build TypeScript:**

   ```bash
   npm run build
   ```

3. **Jalankan server lokal:**

   ```bash
   npm run serve
   ```

4. **Atau jalankan dalam mode development:**

   ```bash
   npm run dev
   ```

5. **Untuk development dengan auto-rebuild:**
   ```bash
   npm run watch
   ```
   Kemudian di terminal lain:
   ```bash
   npm run serve
   ```

Game akan terbuka di browser pada `http://localhost:3000`

## Struktur Project

```
├── src/
│   └── main.ts          # Kode TypeScript utama
├── dist/                # File JavaScript hasil kompilasi
├── index.html           # Halaman utama
├── styles.css           # Styling CSS
├── package.json         # Konfigurasi npm
├── tsconfig.json        # Konfigurasi TypeScript
└── README.md           # Dokumentasi
```

## Cara Bermain

### Tebak Angka

1. Pilih "Tebak Angka" dari menu utama
2. Masukkan angka antara 1-100
3. Ikuti petunjuk untuk menebak angka yang benar
4. **Gunakan Bot Helper:**
   - 💡 **Minta Hint** - Dapatkan petunjuk seberapa dekat tebakan Anda
   - 🤖 **Auto Solve** - Biarkan bot menyelesaikan dengan binary search
   - 📊 **Tampilkan Range** - Lihat range angka yang masih mungkin
5. Coba capai skor terbaik dengan percobaan paling sedikit

### Tic-Tac-Toe

1. Pilih "Tic-Tac-Toe" dari menu utama
2. **Pilih Mode:**
   - **Player vs Player** - Bermain dengan teman
   - **Player vs Bot** - Melawan AI (pilih tingkat kesulitan)
3. Pemain X mulai duluan
4. Klik kotak kosong untuk menempatkan simbol
5. Tujuan: buat 3 simbol berturut-turut (horizontal, vertikal, atau diagonal)
6. Skor akan tersimpan otomatis

### Tips Bermain Melawan Bot

- **Easy Bot**: Cocok untuk pemula, bot bermain acak
- **Medium Bot**: Tantangan sedang, bot kadang bermain optimal
- **Hard Bot**: Sangat sulit, bot menggunakan strategi perfect play
- Coba berbagai strategi untuk mengalahkan bot!

## Fitur Tambahan

- **Responsive Design**: Berfungsi baik di desktop dan mobile
- **Local Storage**: Skor tersimpan meski browser ditutup
- **Animasi**: Transisi halus antar halaman
- **Validasi Input**: Mencegah input yang tidak valid
- **Reset Functionality**: Reset skor kapan saja

## Pengembangan Lebih Lanjut

Beberapa ide untuk pengembangan:

- Tambah level kesulitan untuk tebak angka
- Mode AI untuk Tic-Tac-Toe
- Leaderboard online
- Game tambahan (Snake, Tetris, dll.)
- Multiplayer online
- Sound effects
- Themes/skins

## Lisensi

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan.
