window.buildRecordKey = function (moduleKey, recordId) {
  return moduleKey + ':' + recordId;
};

window.indexRecords = function () {
  window.APP_STATE.recordsById = {};
  [
    { moduleKey: 'students', records: window.APP_STATE.students },
    { moduleKey: 'teachers', records: window.APP_STATE.teachers },
    { moduleKey: 'classes', records: window.APP_STATE.classes },
    { moduleKey: 'announcements', records: window.APP_STATE.announcements }
  ].forEach((group) => {
    group.records.forEach((record) => {
      if (record.ID) {
        window.APP_STATE.recordsById[window.buildRecordKey(group.moduleKey, record.ID)] = record;
      }
    });
  });
};

window.renderDashboard = function (payload) {
  const auth = window.APP_STATE.auth || {};
  const roleLabel = (auth.role || 'viewer').toUpperCase();
  const accessibleModuleCount = window.ALL_VIEWS.filter((view) => view !== 'dashboard' && window.canAccessView(view)).length;
  const publishedAnnouncements = payload.stats.publishedAnnouncements || 0;

  document.getElementById('totalStudents').textContent = payload.stats.totalStudents;
  document.getElementById('totalTeachers').textContent = payload.stats.totalTeachers;
  document.getElementById('activeStudents').textContent = payload.stats.activeStudents;
  document.getElementById('activeTeachers').textContent = payload.stats.activeTeachers;
  document.getElementById('totalClasses').textContent = payload.stats.totalClasses;
  document.getElementById('publishedAnnouncements').textContent = publishedAnnouncements;
  document.getElementById('moduleCount').textContent = accessibleModuleCount + ' Modul';
  document.getElementById('moduleCountCopy').textContent = accessibleModuleCount > 0
    ? 'Akun ini dapat membuka ' + accessibleModuleCount + ' modul kerja sesuai permission backend.'
    : 'Akses modul masih terbatas. Pastikan role backend sudah mengirim daftar view yang benar.';
  document.getElementById('systemHealth').textContent = 'Sinkron';
  document.getElementById('systemHealthCopy').textContent = payload.generatedAt
    ? 'Bootstrap data terakhir dihasilkan pada ' + new Date(payload.generatedAt).toLocaleString('id-ID') + '.'
    : 'Dashboard memakai data bootstrap terbaru yang tersedia di sesi admin ini.';
  document.getElementById('authModeLabel').textContent = roleLabel;
  document.getElementById('authUserLabel').textContent = [auth.name || '-', auth.email || '-'].join(' | ');
  document.getElementById('authSummaryValue').textContent = 'Role ' + roleLabel;
  document.getElementById('authSummaryCopy').textContent = 'Hak akses dashboard mengikuti role dan permission yang dikirim dari backend session admin.';
  document.getElementById('authNoticeTitle').textContent = 'Session ' + roleLabel + ' aktif';
  document.getElementById('authNoticeCopy').textContent = 'Session admin aktif di browser. Vercel meneruskan request ke Apps Script menggunakan session ini untuk memeriksa role dan izin akses modul.';
  document.getElementById('workspaceSummary').textContent = accessibleModuleCount + ' workspace tersedia';
  document.getElementById('workspaceSummaryCopy').textContent = accessibleModuleCount > 2
    ? 'Perpindahan antar modul bisa dilakukan langsung dari sidebar atau kartu workspace di dashboard.'
    : 'Akses modul saat ini masih terbatas. Admin utama bisa membuka workspace tambahan melalui pengaturan role backend.';
  document.getElementById('opsSummary').textContent = publishedAnnouncements > 0
    ? 'Konten publik sedang aktif'
    : 'Belum ada pengumuman tayang';
  document.getElementById('opsSummaryCopy').textContent = publishedAnnouncements > 0
    ? 'Ada ' + publishedAnnouncements + ' pengumuman yang sudah siap atau sedang tampil di kanal publik sekolah.'
    : 'Gunakan modul pengumuman untuk menampilkan agenda dan informasi sekolah agar homepage terasa hidup.';
  document.getElementById('opsModeBadge').textContent = accessibleModuleCount >= 4 ? 'Mode Lengkap' : 'Mode Terbatas';

  document.getElementById('moduleOverview').innerHTML = window.renderModuleOverview(payload.stats);

  document.getElementById('latestAnnouncements').innerHTML = (window.APP_STATE.announcements.slice(0, 4).map((item) => `
    <article class="stack-item">
      <h4>${window.escapeHtml(item.Judul || '-')}</h4>
      <p>${window.escapeHtml(item.Isi || '-')}</p>
      <div class="meta-line">
        <span class="badge">${window.escapeHtml(item.Kategori || 'Informasi')}</span>
        <span>${window.formatDate(item['Tanggal Publikasi'])}</span>
        <span>${window.escapeHtml(item.Status || '-')}</span>
      </div>
    </article>
  `).join('')) || '<p>Belum ada pengumuman.</p>';

  document.getElementById('classHighlights').innerHTML = (window.APP_STATE.classes.slice(0, 5).map((item) => `
    <article class="stack-item">
      <h4>${window.escapeHtml(item['Nama Kelas'] || '-')}</h4>
      <p>Wali kelas: ${window.escapeHtml(item['Wali Kelas'] || '-')}</p>
      <div class="meta-line">
        <span>Kapasitas ${window.escapeHtml(item.Kapasitas || '0')}</span>
        <span>${window.escapeHtml(item['Tahun Ajaran'] || '-')}</span>
        <span class="badge">${window.escapeHtml(item.Status || '-')}</span>
      </div>
    </article>
  `).join('')) || '<p>Belum ada kelas yang terdaftar.</p>';

  document.getElementById('websiteHealth').innerHTML = window.renderWebsiteHealth();
  document.getElementById('authChecklist').innerHTML = window.renderAuthChecklist();
};

window.renderModuleOverview = function (stats) {
  const modules = [
    {
      view: 'website',
      eyebrow: 'Publik',
      shortLabel: 'WEB',
      name: 'Website Sekolah',
      value: window.APP_STATE.websiteSettings['Nama Sekolah'] || 'Siap diatur',
      copy: 'Kelola hero, profil sekolah, program unggulan, dan kontak homepage.',
      tone: 'blue'
    },
    {
      view: 'students',
      eyebrow: 'Akademik',
      shortLabel: 'SSW',
      name: 'Data Siswa',
      value: String(stats.totalStudents || 0),
      copy: 'Pantau jumlah siswa dan lakukan update data akademik harian.',
      tone: 'blue'
    },
    {
      view: 'teachers',
      eyebrow: 'Akademik',
      shortLabel: 'GRU',
      name: 'Data Guru',
      value: String(stats.totalTeachers || 0),
      copy: 'Kelola profil guru, jabatan, dan mata pelajaran dari panel admin.',
      tone: 'gold'
    },
    {
      view: 'classes',
      eyebrow: 'Operasional',
      shortLabel: 'KLS',
      name: 'Data Kelas',
      value: String(stats.totalClasses || 0),
      copy: 'Atur kelas, wali kelas, kapasitas, dan tahun ajaran aktif.',
      tone: 'green'
    },
    {
      view: 'announcements',
      eyebrow: 'Publikasi',
      shortLabel: 'PUB',
      name: 'Pengumuman',
      value: String(stats.publishedAnnouncements || 0),
      copy: 'Publikasikan agenda, informasi akademik, dan pengumuman sekolah.',
      tone: 'slate'
    }
  ];

  return modules.filter((item) => window.canAccessView(item.view)).map((item) => `
    <article class="module-card module-card--${window.escapeAttribute(item.tone)}">
      <div class="module-card__top">
        <span class="module-card__icon">${window.escapeHtml(item.shortLabel)}</span>
        <span class="status-pill status-pill--neutral">${window.escapeHtml(item.eyebrow)}</span>
      </div>
      <span class="module-card__label">${window.escapeHtml(item.name)}</span>
      <strong>${window.escapeHtml(item.value)}</strong>
      <p>${window.escapeHtml(item.copy)}</p>
      <button type="button" class="ghost-button module-card__action" data-go-view="${window.escapeAttribute(item.view)}">Buka Modul</button>
    </article>
  `).join('');
};

window.renderWebsiteHealth = function () {
  const settings = window.APP_STATE.websiteSettings || {};
  const checks = [
    {
      title: 'Nama Sekolah',
      status: settings['Nama Sekolah'] ? 'Terisi' : 'Belum diisi',
      copy: settings['Nama Sekolah'] ? settings['Nama Sekolah'] : 'Lengkapi nama sekolah agar branding homepage lebih jelas.'
    },
    {
      title: 'Hero Website',
      status: settings['Hero Judul'] ? 'Siap tayang' : 'Belum lengkap',
      copy: settings['Hero Judul'] ? settings['Hero Judul'] : 'Isi judul dan deskripsi hero untuk memperkuat tampilan halaman depan.'
    },
    {
      title: 'Kontak Publik',
      status: settings.Email || settings.Telepon ? 'Tersedia' : 'Kosong',
      copy: [settings.Email || null, settings.Telepon || null].filter(Boolean).join(' | ') || 'Tambahkan email atau telepon supaya pengunjung mudah menghubungi sekolah.'
    }
  ];

  return checks.map((item) => `
    <article class="stack-item">
      <div class="stack-item__head">
        <h4>${window.escapeHtml(item.title)}</h4>
        <span class="status-pill status-pill--neutral">${window.escapeHtml(item.status)}</span>
      </div>
      <p>${window.escapeHtml(item.copy)}</p>
    </article>
  `).join('');
};

window.renderAuthChecklist = function () {
  const checks = [
    {
      title: 'Status akses sekarang',
      copy: 'Portal admin memakai session login berbasis akun. Setiap akun bisa punya role dan permission berbeda.'
    },
    {
      title: 'Yang belum ada',
      copy: 'Pastikan backend Apps Script benar-benar memvalidasi password hash, session expiry, dan permission per modul.'
    },
    {
      title: 'Langkah berikut yang disarankan',
      copy: 'Tambahkan audit login, reset password, manajemen user admin, dan proteksi brute-force di backend.'
    }
  ];

  return checks.map((item) => `
    <article class="stack-item">
      <div class="stack-item__head">
        <h4>${window.escapeHtml(item.title)}</h4>
        <span class="status-pill status-pill--blue">Admin</span>
      </div>
      <p>${window.escapeHtml(item.copy)}</p>
    </article>
  `).join('');
};

window.renderGenericTable = function (searchId, targetId, collection, filterColumns, displayColumns, moduleKey) {
  const keyword = document.getElementById(searchId).value.toLowerCase();
  const rows = collection.filter((item) => {
    return filterColumns
      .map((column) => String(item[column] ?? ''))
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  document.getElementById(targetId).innerHTML = window.renderTableRows(rows, displayColumns, moduleKey);
};

window.renderStudentsTable = function () {
  window.renderGenericTable('studentSearch', 'studentsTable', window.APP_STATE.students, ['NIS', 'Nama', 'Kelas'], ['NIS', 'Nama', 'Kelas', 'No HP', 'Status'], 'students');
};

window.renderTeachersTable = function () {
  window.renderGenericTable('teacherSearch', 'teachersTable', window.APP_STATE.teachers, ['NIP', 'Nama', 'Mapel'], ['NIP', 'Nama', 'Jabatan', 'Mapel', 'Status'], 'teachers');
};

window.renderClassesTable = function () {
  window.renderGenericTable('classSearch', 'classesTable', window.APP_STATE.classes, ['Nama Kelas', 'Wali Kelas'], ['Nama Kelas', 'Wali Kelas', 'Kapasitas', 'Tahun Ajaran', 'Status'], 'classes');
};

window.renderAnnouncements = function () {
  const keyword = document.getElementById('announcementSearch').value.toLowerCase();
  const cards = window.APP_STATE.announcements.filter((item) => {
    return ['Judul', 'Kategori', 'Isi']
      .map((column) => String(item[column] ?? ''))
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  document.getElementById('announcementCards').innerHTML = cards.map((item) => `
    <article class="announcement-card">
      <div class="meta-line">
        <span class="badge">${window.escapeHtml(item.Kategori || '-')}</span>
        <span>${window.formatDate(item['Tanggal Publikasi'])}</span>
        <span>${window.escapeHtml(item.Status || '-')}</span>
      </div>
      <h4>${window.escapeHtml(item.Judul || '-')}</h4>
      <p>${window.escapeHtml(item.Isi || '-')}</p>
      <div style="margin-top: 14px;">${window.renderRecordActions('announcements', item.ID)}</div>
    </article>
  `).join('') || '<p>Tidak ada pengumuman yang cocok.</p>';
};

window.renderTableRows = function (rows, columns, moduleKey) {
  if (!rows.length) {
    return `<tr><td colspan="${columns.length + 1}">Belum ada data.</td></tr>`;
  }

  return rows.map((item) => `
    <tr>
      ${columns.map((column) => `<td>${column === 'Status' ? `<span class="badge">${window.escapeHtml(item[column] || '-')}</span>` : window.escapeHtml(item[column] || '-')}</td>`).join('')}
      <td>
        ${window.renderRecordActions(moduleKey, item.ID)}
      </td>
    </tr>
  `).join('');
};

window.renderRecordActions = function (moduleKey, recordId) {
  const actions = [];
  if (window.canWriteModule(moduleKey)) {
    actions.push(`<button type="button" class="edit-btn" data-edit-form="${window.escapeAttribute(window.FORM_IDS[moduleKey])}" data-record-key="${window.escapeAttribute(window.buildRecordKey(moduleKey, recordId))}">Edit</button>`);
  }
  if (window.canDeleteModule(moduleKey)) {
    actions.push(`<button type="button" class="delete-btn" data-delete-module="${window.escapeAttribute(moduleKey)}" data-record-id="${window.escapeAttribute(recordId)}">Hapus</button>`);
  }
  return actions.length ? `<div class="inline-actions">${actions.join('')}</div>` : '<span class="badge">Read Only</span>';
};
