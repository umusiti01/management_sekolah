document.addEventListener('DOMContentLoaded', () => {
  bindNavigation();
  bindActions();
  bindForms();
  bindSearch();
  resetForm('announcementForm');
  resetForm('websiteForm');

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
    } catch (error) {
      window.clearFrontendToken();
      showLogin();
      window.showToast(error.message || 'Gagal membuka dashboard admin.');
    }
  });

  if (window.getFrontendToken()) {
    enterApplication().catch((error) => {
      window.clearFrontendToken();
      showLogin();
      window.showToast(error.message || 'Sesi admin tidak valid.');
    });
  } else {
    showLogin();
  }
});

async function enterApplication() {
  showApp();
  await loadData();
}

function showLogin() {
  document.getElementById('loginScreen').hidden = false;
  document.getElementById('appShell').hidden = true;
}

function showApp() {
  document.getElementById('loginScreen').hidden = true;
  document.getElementById('appShell').hidden = false;
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
    showLogin();
  });

  document.getElementById('seedDataButton').addEventListener('click', () => {
    window.showToast('Seed dimatikan untuk integrasi Vercel demi keamanan.');
  });

  document.querySelectorAll('[data-reset-form]').forEach((button) => {
    button.addEventListener('click', () => resetForm(button.dataset.resetForm));
  });

  document.getElementById('websiteForm').addEventListener('input', () => {
    window.APP_STATE.websiteSettings = Object.fromEntries(new FormData(document.getElementById('websiteForm')).entries());
    renderWebsitePreview();
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
  bindFormSubmit('websiteForm', 'saveSiteSettings');
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
  window.APP_STATE.websiteSettings = payload.websiteSettings || {};
  window.indexRecords();

  window.renderDashboard(payload);
  hydrateWebsiteForm();
  renderWebsitePreview();
  window.renderStudentsTable();
  window.renderTeachersTable();
  window.renderClassesTable();
  window.renderAnnouncements();

  document.getElementById('lastUpdated').textContent =
    'Update: ' + new Date(payload.generatedAt).toLocaleString('id-ID');
}

function hydrateWebsiteForm() {
  const form = document.getElementById('websiteForm');
  Object.keys(window.APP_STATE.websiteSettings || {}).forEach((key) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = window.APP_STATE.websiteSettings[key] || '';
    }
  });
}

function renderWebsitePreview() {
  const settings = window.APP_STATE.websiteSettings || {};
  const image = document.getElementById('websitePreviewImage');
  image.src = settings['Hero Gambar'] || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
  image.alt = (settings['Nama Sekolah'] || 'Sekolah') + ' preview';
  document.getElementById('websitePreviewTitle').textContent = settings['Hero Judul'] || 'Judul hero website';
  document.getElementById('websitePreviewDescription').textContent = settings['Hero Deskripsi'] || 'Deskripsi hero website akan tampil di sini.';
  document.getElementById('websitePreviewSchool').textContent = settings['Nama Sekolah'] || 'Nama sekolah';
  document.getElementById('websitePreviewContact').textContent = [settings.Email || '-', settings.Telepon || '-'].join(' | ');
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
  if (formId === 'websiteForm') {
    hydrateWebsiteForm();
    renderWebsitePreview();
  }
}
