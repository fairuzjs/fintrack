# 💸 FinTrack - Personal Finance Management System

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.x-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NextAuth-4.x-purple?style=flat-square" alt="NextAuth.js" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

FinTrack adalah sistem pencatatan dan manajemen keuangan pribadi interaktif yang dibangun menggunakan Next.js. Aplikasi ini menyediakan platform mutakhir serta terstruktur dengan baik untuk mengelola transaksi masuk dan keluar, manajemen kategori khusus, percetakan dan unduh laporan otomatis ke PDF, dipadukan dengan keamanan autentikasi pengguna secara mandiri.

## ✨ Fitur Utama

### 👥 Untuk Pengguna / Personal

*   **Autentikasi Aman & Multi-Channel**
    *   Login dan Pendaftaran akun difasilitasi dengan `NextAuth.js`.
    *   Kredensial dan kata sandi diamankan menggunakan implementasi hashing `bcryptjs`.
    *   Penyimpanan sesi serta informasi keamanan akun di database (PostgreSQL + Prisma Enum).

*   **Manajemen Keuangan & Arus Kas**
    *   Pencatatan Pemasukan (*Income*) dan Pengeluaran (*Expense*) harian secara fleksibel dan *real-time*.
    *   Kategorisasi terpadu untuk pencatatan (contoh: Gaji bulanan, Kebutuhan harian, Cicilan, dll).
    *   Modal UI Interaktif untuk pendaftaran transaksi (dioptimalkan dari tampilan desain `AddTransactionModal` terbaru).
    *   Data langsung diinterpolasikan untuk perhitungan saldo (*balance*).

*   **Laporan & Ekspor Data**
    *   Filter komprehensif atas daftar riwayat transaksi berdasarkan waktu dan ketersediaan kategori.
    *   Sistem ekspor riwayat mutasi keuangan langsung menjadi sebuah dokumen PDF (*DownloadPdfButton* memanfaatkan `jsPDF` & `jsPDF-autotable`).
    *   Dashboard interaktif terpusat yang ditenagai oleh animasi transisi halus dari `Framer Motion`.

---

## 📸 Preview Proyek

Berikut adalah tampilan antarmuka (*User Interface*) dan cuplikan visualisasi utama dari sistem FinTrack:

### 1. Dashboard Utama
Ringkasan ringkas terkait saldo (*balance*) saat ini, rekapitulasi masuk, rekapitulasi keluar, beserta *chart* atau statistik keseluruhan.
![1. Preview Dashboard FinTrack](https://placehold.co/1200x675/111827/ffffff.png?text=1.+Dashboard+%26+Overview&font=montserrat)

### 2. Manajemen Transaksi 
Halaman interaktif dan modal *popup* yang memungkinkan Anda mengklasifikasikan pendataan (*Add Transaction/Expenses*).
![2. Manajemen Transaksi](https://placehold.co/1200x675/111827/ffffff.png?text=2.+Transaction+Management&font=montserrat)

### 3. Rekap Laporan & Export PDF
Tabel historis dengan *layout* elegan dan fitur cetak komprehensif yang di-generate via *client-side*.
![3. Ekspor PDF](https://placehold.co/1200x675/111827/ffffff.png?text=3.+Historical+Report+%26+PDF+Export&font=montserrat)

> **Catatan:** *Ganti URL gambar placeholder di atas dengan file *.png* dari screenshot asli proyek Anda ke depannya (disarankan menyimpan di folder `public/screenshots/...`) agar tampilan README terlihat lebih akurat untuk sistem riil.*

---

## 🚀 Panduan Instalasi Lokal

### Persyaratan Sistem
*   **Node.js** versi 18+ (atau 20+)
*   Database relasional seperti **PostgreSQL** atau MySQL (Proyek ini secara *default* menggunakan PostgreSQL).

### Langkah-langkah Menjalankan Sistem

1. **Klonasi / Unduh Repositori Project**
   ```bash
   git clone https://github.com/username-anda/fintrack.git
   cd fintrack
   ```

2. **Instalasi Modul Dependensi**
   ```bash
   npm install
   # Atau jika Anda menggunakan manajer package lain: yarn install / pnpm install
   ```

3. **Inisialisasi Environment Variables**
   Buat file bernama `.env` di root direktori dan sesuaikan parameter berikut:
   ```env
   # Koneksi Database URL
   DATABASE_URL="postgresql://user:password@localhost:5432/fintrack?schema=public"

   # Konfigurasi Keamanan NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="masukkan-kode-secara-random-di-sini"
   ```

4. **Konfigurasi Database (Prisma ORM)**
   Sync definisi skema dari `schema.prisma` ke koneksi database di `.env`:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Nyalakan Server di Mode Pengembangan (*Development*)**
   ```bash
   npm run dev
   ```

Buka URL `http://localhost:3000` di peramban (browser) untuk melihat dan berinteraksi secara lokal bersama FinTrack!

---
© **2026 FinTrack Project**. Dibangun untuk pencatatan mandiri yang aman dan cepat. Lisensi proyek ini menggunakan **MIT**.
