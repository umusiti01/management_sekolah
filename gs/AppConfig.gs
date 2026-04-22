const APP_CONFIG = {
  spreadsheetName: 'Database Manajemen Sekolah',
  propertyKeys: {
    spreadsheetId: 'SCHOOL_DB_SPREADSHEET_ID',
    allowedDomain: 'SCHOOL_ALLOWED_DOMAIN',
    adminEmails: 'SCHOOL_ADMIN_EMAILS',
    editorEmails: 'SCHOOL_EDITOR_EMAILS',
    viewerEmails: 'SCHOOL_VIEWER_EMAILS',
    appEnvironment: 'SCHOOL_APP_ENV'
  },
  security: {
    environment: 'production',
    allowSeedInProduction: false
  },
  sheets: {
    students: {
      key: 'students',
      name: 'Siswa',
      headers: ['ID', 'NIS', 'Nama', 'Jenis Kelamin', 'Kelas', 'Orang Tua', 'No HP', 'Alamat', 'Status', 'Tanggal Dibuat', 'Tanggal Diubah', 'Dibuat Oleh', 'Diubah Oleh']
    },
    teachers: {
      key: 'teachers',
      name: 'Guru',
      headers: ['ID', 'NIP', 'Nama', 'Jabatan', 'Mapel', 'No HP', 'Email', 'Status', 'Tanggal Dibuat', 'Tanggal Diubah', 'Dibuat Oleh', 'Diubah Oleh']
    },
    classes: {
      key: 'classes',
      name: 'Kelas',
      headers: ['ID', 'Nama Kelas', 'Wali Kelas', 'Kapasitas', 'Tahun Ajaran', 'Status', 'Tanggal Dibuat', 'Tanggal Diubah', 'Dibuat Oleh', 'Diubah Oleh']
    },
    announcements: {
      key: 'announcements',
      name: 'Pengumuman',
      headers: ['ID', 'Judul', 'Kategori', 'Isi', 'Tanggal Publikasi', 'Status', 'Tanggal Dibuat', 'Tanggal Diubah', 'Dibuat Oleh', 'Diubah Oleh']
    },
    websiteSettings: {
      key: 'websiteSettings',
      name: 'Website',
      headers: [
        'ID',
        'Nama Sekolah',
        'Tagline',
        'Hero Judul',
        'Hero Deskripsi',
        'Hero Gambar',
        'Hero CTA Label',
        'Hero CTA Link',
        'Stat 1 Angka',
        'Stat 1 Label',
        'Stat 2 Angka',
        'Stat 2 Label',
        'Stat 3 Angka',
        'Stat 3 Label',
        'Tentang Judul',
        'Tentang Isi',
        'Program 1 Nama',
        'Program 1 Deskripsi',
        'Program 2 Nama',
        'Program 2 Deskripsi',
        'Program 3 Nama',
        'Program 3 Deskripsi',
        'Alamat',
        'Email',
        'Telepon',
        'Tanggal Dibuat',
        'Tanggal Diubah',
        'Dibuat Oleh',
        'Diubah Oleh'
      ]
    }
  }
};

const SCHOOL_MODULES = {
  students: {
    sheetKey: 'students',
    editableFields: ['NIS', 'Nama', 'Jenis Kelamin', 'Kelas', 'Orang Tua', 'No HP', 'Alamat', 'Status'],
    requiredFields: ['NIS', 'Nama', 'Jenis Kelamin', 'Kelas', 'Status'],
    enumFields: {
      'Jenis Kelamin': ['Laki-laki', 'Perempuan'],
      'Status': ['Aktif', 'Cuti', 'Lulus', 'Nonaktif']
    },
    uniqueRules: [
      { fields: ['NIS'], label: 'NIS' }
    ]
  },
  teachers: {
    sheetKey: 'teachers',
    editableFields: ['NIP', 'Nama', 'Jabatan', 'Mapel', 'No HP', 'Email', 'Status'],
    requiredFields: ['NIP', 'Nama', 'Jabatan', 'Mapel', 'Status'],
    enumFields: {
      'Status': ['Aktif', 'Cuti', 'Pensiun', 'Nonaktif']
    },
    uniqueRules: [
      { fields: ['NIP'], label: 'NIP' }
    ]
  },
  classes: {
    sheetKey: 'classes',
    editableFields: ['Nama Kelas', 'Wali Kelas', 'Kapasitas', 'Tahun Ajaran', 'Status'],
    requiredFields: ['Nama Kelas', 'Wali Kelas', 'Tahun Ajaran', 'Status'],
    enumFields: {
      'Status': ['Aktif', 'Penuh', 'Ditutup']
    },
    uniqueRules: [
      { fields: ['Nama Kelas', 'Tahun Ajaran'], label: 'Nama Kelas + Tahun Ajaran' }
    ]
  },
  announcements: {
    sheetKey: 'announcements',
    editableFields: ['Judul', 'Kategori', 'Isi', 'Tanggal Publikasi', 'Status'],
    requiredFields: ['Judul', 'Kategori', 'Isi', 'Tanggal Publikasi', 'Status'],
    enumFields: {
      'Kategori': ['Agenda', 'Akademik', 'Keuangan', 'Kegiatan', 'Informasi Umum'],
      'Status': ['Tayang', 'Draft', 'Arsip']
    },
    uniqueRules: []
  },
  websiteSettings: {
    sheetKey: 'websiteSettings',
    editableFields: [
      'Nama Sekolah',
      'Tagline',
      'Hero Judul',
      'Hero Deskripsi',
      'Hero Gambar',
      'Hero CTA Label',
      'Hero CTA Link',
      'Stat 1 Angka',
      'Stat 1 Label',
      'Stat 2 Angka',
      'Stat 2 Label',
      'Stat 3 Angka',
      'Stat 3 Label',
      'Tentang Judul',
      'Tentang Isi',
      'Program 1 Nama',
      'Program 1 Deskripsi',
      'Program 2 Nama',
      'Program 2 Deskripsi',
      'Program 3 Nama',
      'Program 3 Deskripsi',
      'Alamat',
      'Email',
      'Telepon'
    ],
    requiredFields: ['Nama Sekolah', 'Hero Judul', 'Hero Deskripsi'],
    enumFields: {},
    uniqueRules: []
  }
};
