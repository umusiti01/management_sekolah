# SchoolOps - Google Apps Script Manajemen Sekolah

Starter project ini adalah aplikasi web berbasis Google Apps Script untuk mengelola:

- Data siswa
- Data guru
- Data kelas
- Pengumuman sekolah
- Ringkasan dashboard operasional

## Struktur File Modular

- `appsscript.json`: konfigurasi project Apps Script
- `gs/AppConfig.gs`: semua konfigurasi sheet, schema, dan mapping modul
- `gs/Main.gs`: entry point Web App dan fungsi publik untuk client
- `gs/Database.gs`: inisialisasi spreadsheet dan akses sheet
- `gs/Auth.gs`: guard autentikasi dan otorisasi berbasis email/domain
- `gs/Repositories.gs`: layer akses data spreadsheet
- `gs/Services.gs`: service dashboard dan CRUD lintas modul
- `gs/Validation.gs`: validasi backend dan aturan integritas data
- `gs/SeedData.gs`: data contoh awal
- `Index.html`: shell utama halaman
- `Layout.html`: layout utama dashboard
- `ViewDashboard.html`, `ViewStudents.html`, `ViewTeachers.html`, `ViewClasses.html`, `ViewAnnouncements.html`: view per modul
- `BaseStylesheet.html`, `ComponentStylesheet.html`: styling dasar dan komponen
- `AppConfigJs.html`: konstanta dan state client
- `AppUtilsJs.html`: utilitas UI
- `AppApiJs.html`: wrapper komunikasi client ke Apps Script
- `AppRenderersJs.html`: semua renderer dashboard, tabel, dan card
- `AppHandlersJs.html`: event binding, form handling, dan lifecycle halaman

## Cara Pakai di Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/).
2. Buat project baru.
3. Salin semua file pada folder ini ke project Apps Script dengan nama yang sama.
4. Atur `Script Properties` minimal untuk keamanan:
   - `SCHOOL_ADMIN_EMAILS`
   - `SCHOOL_EDITOR_EMAILS`
   - `SCHOOL_VIEWER_EMAILS`
   - `SCHOOL_ALLOWED_DOMAIN` jika memakai Google Workspace sekolah
   - `SCHOOL_APP_ENV` dengan nilai `production` atau `development`
5. Jalankan fungsi `initializeDatabase` sekali memakai akun admin untuk membuat spreadsheet database otomatis.
6. Jalankan fungsi `doGet` lewat deployment Web App:
   - `Deploy` -> `New deployment`
   - Pilih `Web app`
   - Execute as: `Me`
   - Who has access: gunakan akun domain internal yang sesuai dengan manifest
7. Buka URL hasil deployment.

Catatan:
- Manifest sekarang memakai `webapp.access = DOMAIN`, sehingga cocok untuk Google Workspace sekolah.
- Jika Anda belum memakai Google Workspace, ubah akses deployment dan sesuaikan guard auth dengan model login yang Anda pakai sebelum go-live.

## Pengamanan Yang Sudah Ditambahkan

- Web app tidak lagi dibuka untuk publik anonim
- Seluruh endpoint server dibatasi oleh guard role `viewer`, `editor`, dan `admin`
- Delete sekarang menerima `moduleKey`, bukan nama sheet mentah dari browser
- Validasi backend untuk required fields, enum, format, dan uniqueness
- Upsert sekarang merge dengan data lama, bukan overwrite buta
- Audit trail menambah `Tanggal Diubah`, `Dibuat Oleh`, dan `Diubah Oleh`
- Seed sample data dibatasi admin dan dimatikan di production secara default

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
