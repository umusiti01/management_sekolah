document.addEventListener('DOMContentLoaded', () => {
  setPublicMode();
  closePortalModal();
  bindAccessGate();
  bindNavigation();
  bindActions();
  bindForms();
  bindSearch();
  resetForm('announcementForm');
  if (window.getFrontendToken()) {
    enterApplication().catch((error) => {
      window.clearFrontendToken();
      setPublicMode();
      window.showToast(error.message || 'Gagal membuka portal. Halaman sekolah publik ditampilkan kembali.');
    });
  }
});

function bindAccessGate() {
  document.querySelectorAll('[data-open-portal-role]').forEach((button) => {
    button.addEventListener('click', () => openPortalModal(button.dataset.openPortalRole));
  });

  document.querySelectorAll('[data-close-portal]').forEach((element) => {
    element.addEventListener('click', closePortalModal);
  });

  document.getElementById('accessForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = document.getElementById('frontendToken').value.trim();
    if (!token) {
      window.showToast('Token frontend wajib diisi.');
      return;
    }

    window.setFrontendToken(token);
    try {
      await enterApplication();
      closePortalModal();
    } catch (error) {
      window.clearFrontendToken();
      setPublicMode();
      window.showToast(error.message);
    }
  });
}

async function enterApplication() {
  setAppMode();
  await loadData();
}

function bindNavigation() {
  document.querySelectorAll('.menu-item').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.view').forEach((view) => view.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(button.dataset.view + 'View').classList.add('active');
      document.getElementById('pageTitle').textContent = window.VIEW_TITLES[button.dataset.view];
    });
  });
}

function bindActions() {
  document.getElementById('refreshButton').addEventListener('click', () => {
    loadData().catch((error) => window.showToast(error.message));
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    window.clearFrontendToken();
    setPublicMode();
    closePortalModal();
  });

  document.getElementById('seedDataButton').addEventListener('click', () => {
    window.showToast('Seed dimatikan untuk integrasi Vercel demi keamanan.');
  });

  document.querySelectorAll('[data-reset-form]').forEach((button) => {
    button.addEventListener('click', () => resetForm(button.dataset.resetForm));
  });

  document.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-form]');
    if (editButton) {
      const record = window.APP_STATE.recordsById[editButton.dataset.recordKey];
      if (record) {
        editRecord(editButton.dataset.editForm, record);
      }
    }

    const deleteButton = event.target.closest('[data-delete-module]');
    if (deleteButton) {
      deleteRecordHandler(deleteButton.dataset.deleteModule, deleteButton.dataset.recordId);
    }
  });
}

function bindForms() {
  bindFormSubmit('studentForm', 'saveStudent');
  bindFormSubmit('teacherForm', 'saveTeacher');
  bindFormSubmit('classForm', 'saveClassroom');
  bindFormSubmit('announcementForm', 'saveAnnouncement');
}

function bindFormSubmit(formId, actionName) {
  document.getElementById(formId).addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = document.getElementById(formId);
    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await window.runServerAction(actionName, formData);
      window.showToast(response.message || 'Data berhasil disimpan.');
      resetForm(formId);
      await loadData();
    } catch (error) {
      window.showToast(error.message);
    }
  });
}

function bindSearch() {
  document.getElementById('studentSearch').addEventListener('input', window.renderStudentsTable);
  document.getElementById('teacherSearch').addEventListener('input', window.renderTeachersTable);
  document.getElementById('classSearch').addEventListener('input', window.renderClassesTable);
  document.getElementById('announcementSearch').addEventListener('input', window.renderAnnouncements);
}

async function loadData() {
  document.getElementById('lastUpdated').textContent = 'Memuat data...';
  const payload = await window.runServerAction('getBootstrapData');
  window.APP_STATE.students = payload.students || [];
  window.APP_STATE.teachers = payload.teachers || [];
  window.APP_STATE.classes = payload.classes || [];
  window.APP_STATE.announcements = payload.announcements || [];
  window.indexRecords();

  window.renderDashboard(payload);
  window.renderStudentsTable();
  window.renderTeachersTable();
  window.renderClassesTable();
  window.renderAnnouncements();

  document.getElementById('lastUpdated').textContent =
    'Update: ' + new Date(payload.generatedAt).toLocaleString('id-ID');
}

function editRecord(formId, record) {
  const form = document.getElementById(formId);
  Object.keys(record).forEach((key) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = field.type === 'date' ? window.normalizeDateForInput(record[key]) : record[key];
    }
  });
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteRecordHandler(moduleKey, id) {
  if (!window.confirm('Hapus data ini?')) {
    return;
  }

  try {
    await window.runServerAction('deleteRecord', {
      moduleKey: moduleKey,
      id: id
    });
    window.showToast('Data berhasil dihapus.');
    await loadData();
  } catch (error) {
    window.showToast(error.message);
  }
}

function resetForm(formId) {
  const form = document.getElementById(formId);
  form.reset();
  const idField = form.elements.namedItem('ID');
  if (idField) {
    idField.value = '';
  }
  const dateField = form.elements.namedItem('Tanggal Publikasi');
  if (dateField) {
    dateField.value = new Date().toISOString().slice(0, 10);
  }
}

function openPortalModal(role) {
  applyPortalRole(role || 'admin');
  document.getElementById('portalModal').hidden = false;
}

function closePortalModal() {
  document.getElementById('portalModal').hidden = true;
}

function setPublicMode() {
  document.getElementById('publicSite').hidden = false;
  document.getElementById('appShell').hidden = true;
}

function setAppMode() {
  document.getElementById('publicSite').hidden = true;
  document.getElementById('appShell').hidden = false;
}

function applyPortalRole(role) {
  const roleMap = {
    admin: {
      title: 'Masuk sebagai Admin',
      description: 'Gunakan token akses admin untuk membuka dashboard pengelolaan data sekolah dan pengaturan operasional.'
    },
    teacher: {
      title: 'Masuk sebagai Guru',
      description: 'Gunakan token akses guru untuk membuka portal akademik, informasi kelas, dan pengumuman internal.'
    },
    principal: {
      title: 'Masuk sebagai Kepala Sekolah',
      description: 'Gunakan token akses kepala sekolah untuk membuka ringkasan manajemen, laporan, dan pengawasan sekolah.'
    }
  };

  const selected = roleMap[role] || roleMap.admin;
  document.getElementById('portalRoleTitle').textContent = selected.title;
  document.getElementById('portalRoleDescription').textContent = selected.description;
}
