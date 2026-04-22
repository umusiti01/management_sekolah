# SchoolOps - Apps Script Backend + Vercel Frontend

Starter project ini memakai arsitektur:

- Google Apps Script sebagai backend API
- Vercel sebagai frontend penuh

Project ini mengelola:

- Data siswa
- Data guru
- Data kelas
- Pengumuman sekolah
- Ringkasan dashboard operasional

## Struktur File Modular

- `appsscript.json`: manifest Apps Script untuk backend API-only
- `gs/AppConfig.gs`: semua konfigurasi sheet, schema, dan mapping modul
- `gs/Main.gs`: entry point backend API dan helper server-side
- `gs/Database.gs`: inisialisasi spreadsheet dan akses sheet
- `gs/Auth.gs`: guard autentikasi dan otorisasi berbasis email/domain
- `gs/Repositories.gs`: layer akses data spreadsheet
- `gs/Services.gs`: service dashboard dan CRUD lintas modul
- `gs/Validation.gs`: validasi backend dan aturan integritas data
- `gs/SeedData.gs`: data contoh awal
- `site/index.html`: frontend statis untuk Vercel
- `site/styles/base.css`, `site/styles/components.css`: file CSS frontend Vercel
- `site/js/*.js`: file JavaScript frontend Vercel
- `api/school.js`: Vercel serverless proxy ke Apps Script
- `vercel.json`: rewrite root Vercel ke frontend statis
- `.env.example`: contoh environment variable untuk Vercel
- `vercel.env.txt`: file siap copy untuk environment Vercel
- `apps-script-properties.txt`: file siap copy untuk Script Properties Apps Script

## Yang Diupload Ke Apps Script

Karena sekarang Apps Script dipakai sebagai backend-only, yang diupload ke project Apps Script hanya:

- `appsscript.json`
- semua file di folder `gs/`

File HTML root lama tidak diperlukan untuk mode backend-only.

## Cara Pakai di Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/).
2. Buat project baru.
3. Salin `appsscript.json` dan semua file di folder `gs/` ke project Apps Script.
4. Atur `Script Properties` minimal untuk keamanan:
   - `SCHOOL_ADMIN_EMAILS`
   - `SCHOOL_EDITOR_EMAILS`
   - `SCHOOL_VIEWER_EMAILS`
   - `SCHOOL_ALLOWED_DOMAIN` jika memakai Google Workspace sekolah
   - `SCHOOL_APP_ENV` dengan nilai `production` atau `development`
   - `SCHOOL_API_TOKEN` untuk koneksi aman dari Vercel ke Apps Script
5. Jalankan fungsi `initializeDatabase` sekali memakai akun admin untuk membuat spreadsheet database otomatis.
6. Deploy project sebagai Web App:
   - `Deploy` -> `New deployment`
   - Pilih `Web app`
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Gunakan URL `/exec` hasil deployment sebagai `APPS_SCRIPT_URL` di Vercel.

Catatan:
- Manifest sekarang memakai `webapp.access = ANYONE_ANONYMOUS` agar Vercel bisa memanggil endpoint server-to-server.
- Keamanan utama tetap dijaga oleh `SCHOOL_API_TOKEN`, bukan oleh akses publik ke URL.
- Jika `SCHOOL_APP_ENV=development` dan allowlist email/domain belum diisi, editor Apps Script akan mendapat bypass akses sementara untuk setup lokal.
- Untuk production, isi allowlist yang sesuai atau gunakan kebijakan domain sekolah.

## Pengamanan Yang Sudah Ditambahkan

- URL backend boleh diakses publik agar Vercel dapat terhubung server-to-server
- Seluruh endpoint server dibatasi oleh guard role `viewer`, `editor`, dan `admin`
- Delete sekarang menerima `moduleKey`, bukan nama sheet mentah dari browser
- Validasi backend untuk required fields, enum, format, dan uniqueness
- Upsert sekarang merge dengan data lama, bukan overwrite buta
- Audit trail menambah `Tanggal Diubah`, `Dibuat Oleh`, dan `Diubah Oleh`
- Seed sample data dibatasi admin dan dimatikan di production secara default
- Endpoint `doPost` tokenized untuk koneksi aman dari Vercel ke Apps Script

Catatan:
- Endpoint backend sekarang memang dapat diakses publik di level URL karena Vercel memerlukan akses server-to-server.
- Namun operasi API hanya berjalan jika request membawa token yang cocok dengan `SCHOOL_API_TOKEN`.

## Yang Diupload Ke Vercel

Yang dipakai Vercel:

- `site/`
- `api/`
- `vercel.json`
- environment variables

## Frontend Vercel

CSS frontend Vercel sekarang ada di:

- `site/styles/base.css`
- `site/styles/components.css`

Arsitektur koneksinya:

1. User membuka frontend di Vercel.
2. Frontend mengirim request ke `/api/school` di Vercel.
3. Vercel membaca `APPS_SCRIPT_URL` dan `APPS_SCRIPT_API_TOKEN` dari environment.
4. Vercel meneruskan request ke Apps Script memakai token server-side.
5. Apps Script memverifikasi `SCHOOL_API_TOKEN` lalu menjalankan action yang diminta.

Token yang dipakai:

- `FRONTEND_ACCESS_TOKEN`: token login sederhana antara browser dan Vercel
- `APPS_SCRIPT_API_TOKEN`: token rahasia antara Vercel dan Apps Script

## Setup Vercel

1. Import repo GitHub ini ke Vercel.
2. Tambahkan environment variables:
   - `APPS_SCRIPT_URL`
   - `APPS_SCRIPT_API_TOKEN`
   - `FRONTEND_ACCESS_TOKEN`
3. Deploy project.
4. Buka URL Vercel lalu login memakai `FRONTEND_ACCESS_TOKEN`.

Catatan penting:

- `FRONTEND_ACCESS_TOKEN` adalah proteksi ringan untuk frontend admin.
- Token paling sensitif adalah `APPS_SCRIPT_API_TOKEN` dan token ini tetap aman karena hanya dibaca oleh serverless Vercel, bukan browser.

## Database

Aplikasi akan otomatis membuat Google Spreadsheet baru dan menyimpan ID-nya pada `Script Properties`.

Sheet yang dibuat:

- `Siswa`
- `Guru`
- `Kelas`
- `Pengumuman`

## Fitur Awal

- Dashboard metrik sekolah
- CRUD data siswa
- CRUD data guru
- CRUD data kelas
- CRUD pengumuman
- Pencarian cepat di setiap modul
- Tombol isi data contoh
- Struktur modular agar maintenance dan penambahan fitur lebih cepat

## Pengembangan Lanjutan yang Direkomendasikan

- Modul absensi siswa dan guru
- Modul pembayaran SPP
- Hak akses admin, guru, dan wali kelas
- Cetak laporan PDF
- Integrasi WhatsApp atau email notifikasi
- Upload foto siswa/guru ke Google Drive
