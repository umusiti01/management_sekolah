function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      service: 'SchoolOps Apps Script Backend',
      mode: 'api-only',
      methods: ['GET', 'POST'],
      postActions: [
        'getBootstrapData',
        'getPublicSiteContent',
        'saveStudent',
        'saveTeacher',
        'saveClassroom',
        'saveAnnouncement',
        'saveSiteSettings',
        'deleteRecord'
      ],
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function initializeDatabase() {
  AuthService.requireAdminAccess();
  DatabaseInitializer.initialize();
}

function getBootstrapData() {
  return SchoolDashboardService.getBootstrapData();
}

function saveStudent(payload) {
  return SchoolCrudService.save('students', payload);
}

function saveTeacher(payload) {
  return SchoolCrudService.save('teachers', payload);
}

function saveClassroom(payload) {
  return SchoolCrudService.save('classes', payload);
}

function saveAnnouncement(payload) {
  return SchoolCrudService.save('announcements', payload);
}

function getPublicSiteContent() {
  return WebsiteContentService.getPublicSiteContent();
}

function saveSiteSettings(payload) {
  return WebsiteContentService.saveSiteSettings(payload);
}

function deleteRecord(moduleKey, id) {
  return SchoolCrudService.remove(moduleKey, id);
}

function seedSampleData() {
  return SchoolSeedService.seedSampleData();
}
