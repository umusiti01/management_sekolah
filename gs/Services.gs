const SchoolDashboardService = {
  getBootstrapData: function () {
    const access = AuthService.requireReadAccess();
    DatabaseInitializer.initialize();

    const students = SheetRepository.findAllByModule('students');
    const teachers = SheetRepository.findAllByModule('teachers');
    const classes = SheetRepository.findAllByModule('classes');
    const announcements = SheetRepository.findAllByModule('announcements').sort(AppUtilities.sortByDateDesc);
    const websiteSettings = WebsiteContentService.getSiteSettingsRecord_();

    return {
      auth: {
        email: access.email,
        isAdmin: access.isAdmin,
        canWrite: access.canWrite,
        canDelete: access.canDelete,
        canSeed: access.canSeed
      },
      stats: {
        totalStudents: students.length,
        activeStudents: students.filter(function (item) { return item.Status === 'Aktif'; }).length,
        totalTeachers: teachers.length,
        activeTeachers: teachers.filter(function (item) { return item.Status === 'Aktif'; }).length,
        totalClasses: classes.length,
        publishedAnnouncements: announcements.filter(function (item) { return item.Status === 'Tayang'; }).length
      },
      students: AppUtilities.toClientRecords('students', students),
      teachers: AppUtilities.toClientRecords('teachers', teachers),
      classes: AppUtilities.toClientRecords('classes', classes),
      announcements: AppUtilities.toClientRecords('announcements', announcements),
      websiteSettings: AppUtilities.toClientRecords('websiteSettings', [websiteSettings])[0],
      generatedAt: new Date().toISOString()
    };
  }
};

const WebsiteContentService = {
  getPublicSiteContent: function () {
    DatabaseInitializer.initialize();
    const websiteSettings = this.getSiteSettingsRecord_();
    const announcements = SheetRepository.findAllByModule('announcements')
      .filter(function (item) { return item.Status === 'Tayang'; })
      .sort(AppUtilities.sortByDateDesc)
      .slice(0, 3);

    return {
      websiteSettings: AppUtilities.toClientRecords('websiteSettings', [websiteSettings])[0],
      announcements: AppUtilities.toClientRecords('announcements', announcements),
      generatedAt: new Date().toISOString()
    };
  },

  saveSiteSettings: function (payload) {
    const access = AuthService.requireWriteAccess();
    const normalizedPayload = ValidationService.validateAndNormalize('websiteSettings', payload);
    normalizedPayload.ID = payload.ID || 'website-settings';
    const result = SheetRepository.upsert('websiteSettings', normalizedPayload, access.email);

    return {
      success: true,
      id: result.id,
      message: 'Pengaturan website berhasil disimpan.',
      data: SCHOOL_MODULES.websiteSettings.editableFields.reduce(function (record, field) {
        record[field] = normalizedPayload[field] || '';
        return record;
      }, { ID: result.id })
    };
  },

  getSiteSettingsRecord_: function () {
    const records = SheetRepository.findAllByModule('websiteSettings');
    const record = records[0] || {};

    return Object.assign({
      ID: 'website-settings',
      'Nama Sekolah': 'SMK SchoolOps Nusantara',
      'Tagline': 'Sekolah vokasi modern yang unggul, tertib, dan siap masa depan.',
      'Hero Judul': 'Membentuk Generasi Siap Kerja, Siap Kuliah, dan Siap Memimpin.',
      'Hero Deskripsi': 'SMK SchoolOps Nusantara menghadirkan pembelajaran vokasi yang dekat dengan industri, kuat di karakter, dan ramah teknologi untuk menyiapkan lulusan yang percaya diri.',
      'Hero Gambar': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      'Hero CTA Label': 'Info PPDB',
      'Hero CTA Link': '#kontak',
      'Stat 1 Angka': '1.250+',
      'Stat 1 Label': 'Siswa Aktif',
      'Stat 2 Angka': '78',
      'Stat 2 Label': 'Tenaga Pendidik',
      'Stat 3 Angka': '96%',
      'Stat 3 Label': 'Lulusan Terserap',
      'Tentang Judul': 'Lingkungan belajar yang tertib, hangat, dan berorientasi masa depan.',
      'Tentang Isi': 'Website sekolah adalah wajah institusi. Karena itu tampilannya harus hidup, visual, dan informatif sambil tetap mudah dikelola oleh admin sekolah.',
      'Program 1 Nama': 'Rekayasa Perangkat Lunak',
      'Program 1 Deskripsi': 'Belajar coding, UI/UX, project digital, dan penguatan portofolio teknologi.',
      'Program 2 Nama': 'Akuntansi dan Keuangan',
      'Program 2 Deskripsi': 'Penguasaan laporan keuangan, administrasi bisnis, dan aplikasi perkantoran modern.',
      'Program 3 Nama': 'Teknik Jaringan Komputer',
      'Program 3 Deskripsi': 'Instalasi jaringan, keamanan dasar, dan praktik laboratorium berbasis industri.',
      'Alamat': 'Jl. Pendidikan No. 10, Nusantara, Indonesia',
      'Email': 'info@schoolops.sch.id',
      'Telepon': '(021) 555-7788'
    }, record);
  }
};

const SchoolCrudService = {
  save: function (moduleKey, payload) {
    const access = AuthService.requireWriteAccess();
    const moduleConfig = SCHOOL_MODULES[moduleKey];
    const normalizedPayload = ValidationService.validateAndNormalize(moduleKey, payload);
    const result = SheetRepository.upsert(moduleKey, normalizedPayload, access.email);

    return {
      success: true,
      id: result.id,
      message: 'Data berhasil disimpan.',
      data: moduleConfig.editableFields.reduce(function (record, field) {
        record[field] = normalizedPayload[field] || '';
        return record;
      }, { ID: result.id })
    };
  },

  remove: function (moduleKey, id) {
    AuthService.requireAdminAccess();
    return SheetRepository.removeById(moduleKey, id);
  }
};

const AppUtilities = {
  sortByDateDesc: function (a, b) {
    return new Date(b['Tanggal Publikasi'] || b['Tanggal Dibuat']).getTime() -
      new Date(a['Tanggal Publikasi'] || a['Tanggal Dibuat']).getTime();
  },

  createId: function () {
    return Utilities.getUuid();
  },

  toClientRecords: function (moduleKey, records) {
    const fields = ['ID'].concat(SCHOOL_MODULES[moduleKey].editableFields);
    return records.map(function (record) {
      return fields.reduce(function (acc, field) {
        acc[field] = record[field] || '';
        return acc;
      }, {});
    });
  }
};
