const SchoolSeedService = {
  seedSampleData: function () {
    const access = AuthService.requireAdminAccess();
    if (!access.canSeed) {
      throw new Error('Seed data dimatikan pada environment production.');
    }

    DatabaseInitializer.initialize();

    if (SheetRepository.findAllByModule('students').length > 0) {
      return { success: false, message: 'Database sudah berisi data.' };
    }

    const classrooms = [
      {
        'Nama Kelas': 'X IPA 1',
        'Wali Kelas': 'Dewi Larasati',
        'Kapasitas': '36',
        'Tahun Ajaran': '2026/2027',
        'Status': 'Aktif'
      },
      {
        'Nama Kelas': 'XI IPS 2',
        'Wali Kelas': 'Arif Pratama',
        'Kapasitas': '32',
        'Tahun Ajaran': '2026/2027',
        'Status': 'Aktif'
      }
    ];

    const teachers = [
      {
        'NIP': '198901122015041001',
        'Nama': 'Dewi Larasati',
        'Jabatan': 'Wali Kelas',
        'Mapel': 'Biologi',
        'No HP': '081234567890',
        'Email': 'dewi.larasati@schoolops.sch.id',
        'Status': 'Aktif'
      },
      {
        'NIP': '198803112014121004',
        'Nama': 'Arif Pratama',
        'Jabatan': 'Guru',
        'Mapel': 'Ekonomi',
        'No HP': '081355577799',
        'Email': 'arif.pratama@schoolops.sch.id',
        'Status': 'Aktif'
      }
    ];

    const students = [
      {
        'NIS': '2401001',
        'Nama': 'Nadia Putri',
        'Jenis Kelamin': 'Perempuan',
        'Kelas': 'X IPA 1',
        'Orang Tua': 'Budi Santoso',
        'No HP': '081299988877',
        'Alamat': 'Jl. Melati No. 10',
        'Status': 'Aktif'
      },
      {
        'NIS': '2401002',
        'Nama': 'Raka Maulana',
        'Jenis Kelamin': 'Laki-laki',
        'Kelas': 'XI IPS 2',
        'Orang Tua': 'Siti Maesaroh',
        'No HP': '081288877766',
        'Alamat': 'Jl. Kenanga No. 5',
        'Status': 'Aktif'
      }
    ];

    const announcements = [
      {
        'Judul': 'Rapat Wali Murid Semester Genap',
        'Kategori': 'Agenda',
        'Isi': 'Rapat wali murid dilaksanakan Jumat pukul 08.00 di aula sekolah.',
        'Tanggal Publikasi': Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        'Status': 'Tayang'
      }
    ];

    const websiteSettings = {
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
    };

    classrooms.forEach(function (payload) { SchoolCrudService.save('classes', payload); });
    teachers.forEach(function (payload) { SchoolCrudService.save('teachers', payload); });
    students.forEach(function (payload) { SchoolCrudService.save('students', payload); });
    announcements.forEach(function (payload) { SchoolCrudService.save('announcements', payload); });
    WebsiteContentService.saveSiteSettings(websiteSettings);

    return { success: true, message: 'Contoh data berhasil dibuat.' };
  }
};
