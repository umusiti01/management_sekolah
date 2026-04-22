window.APP_STATE = {
  students: [],
  teachers: [],
  classes: [],
  announcements: [],
  websiteSettings: {},
  recordsById: {},
  auth: {
    email: 'vercel-token',
    isAdmin: true,
    canWrite: true,
    canDelete: true,
    canSeed: false
  }
};

window.FORM_IDS = {
  students: 'studentForm',
  teachers: 'teacherForm',
  classes: 'classForm',
  announcements: 'announcementForm',
  website: 'websiteForm'
};

window.FORM_MODULES = {
  studentForm: 'students',
  teacherForm: 'teachers',
  classForm: 'classes',
  announcementForm: 'announcements',
  websiteForm: 'website'
};

window.VIEW_TITLES = {
  dashboard: 'Dashboard Sekolah',
  website: 'CMS Website Sekolah',
  students: 'Manajemen Siswa',
  teachers: 'Manajemen Guru',
  classes: 'Manajemen Kelas',
  announcements: 'Pengumuman Sekolah'
};
