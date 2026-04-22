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
  document.getElementById('totalStudents').textContent = payload.stats.totalStudents;
  document.getElementById('totalTeachers').textContent = payload.stats.totalTeachers;
  document.getElementById('activeStudents').textContent = payload.stats.activeStudents;
  document.getElementById('activeTeachers').textContent = payload.stats.activeTeachers;
  document.getElementById('totalClasses').textContent = payload.stats.totalClasses;
  document.getElementById('publishedAnnouncements').textContent = payload.stats.publishedAnnouncements;

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
      <div class="inline-actions" style="margin-top: 14px;">
        <button type="button" class="edit-btn" data-edit-form="${window.escapeAttribute(window.FORM_IDS.announcements)}" data-record-key="${window.escapeAttribute(window.buildRecordKey('announcements', item.ID))}">Edit</button>
        <button type="button" class="delete-btn" data-delete-module="announcements" data-record-id="${window.escapeAttribute(item.ID)}">Hapus</button>
      </div>
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
        <div class="inline-actions">
          <button type="button" class="edit-btn" data-edit-form="${window.escapeAttribute(window.FORM_IDS[moduleKey])}" data-record-key="${window.escapeAttribute(window.buildRecordKey(moduleKey, item.ID))}">Edit</button>
          <button type="button" class="delete-btn" data-delete-module="${window.escapeAttribute(moduleKey)}" data-record-id="${window.escapeAttribute(item.ID)}">Hapus</button>
        </div>
      </td>
    </tr>
  `).join('');
};
