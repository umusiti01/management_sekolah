function doPost(e) {
  return AppsScriptApiController.handle(e);
}

const AppsScriptApiController = {
  handle: function (e) {
    try {
      const request = this.parseRequest_(e);
      const access = this.authenticate_(request);
      RequestContext.setAccessContext(access);

      const response = this.dispatch_(request.action, request.payload || {});
      return this.createJsonResponse_({
        success: true,
        data: response
      });
    } catch (error) {
      return this.createJsonResponse_({
        success: false,
        error: error.message || 'Terjadi kesalahan pada API Apps Script.'
      });
    } finally {
      RequestContext.clear();
    }
  },

  parseRequest_: function (e) {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Request body tidak ditemukan.');
    }

    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      throw new Error('Format JSON request tidak valid.');
    }
  },

  authenticate_: function (request) {
    const configuredToken = (PropertiesService.getScriptProperties().getProperty('SCHOOL_API_TOKEN') || '').trim();
    if (!configuredToken) {
      throw new Error('SCHOOL_API_TOKEN belum diatur pada Script Properties.');
    }

    if (!request.token || String(request.token).trim() !== configuredToken) {
      throw new Error('Token API tidak valid.');
    }

    return {
      email: 'vercel-api',
      isAdmin: true,
      canRead: true,
      canWrite: true,
      canDelete: true,
      canSeed: false
    };
  },

  dispatch_: function (action, payload) {
    switch (action) {
      case 'getBootstrapData':
        return SchoolDashboardService.getBootstrapData();
      case 'getPublicSiteContent':
        return WebsiteContentService.getPublicSiteContent();
      case 'saveStudent':
        return SchoolCrudService.save('students', payload);
      case 'saveTeacher':
        return SchoolCrudService.save('teachers', payload);
      case 'saveClassroom':
        return SchoolCrudService.save('classes', payload);
      case 'saveAnnouncement':
        return SchoolCrudService.save('announcements', payload);
      case 'saveSiteSettings':
        return WebsiteContentService.saveSiteSettings(payload);
      case 'deleteRecord':
        return SchoolCrudService.remove(payload.moduleKey, payload.id);
      default:
        throw new Error('Action API tidak dikenali: ' + action);
    }
  },

  createJsonResponse_: function (payload) {
    return ContentService
      .createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  }
};
