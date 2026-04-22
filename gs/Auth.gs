var AuthService = {
  requireAppAccess: function () {
    const access = this.getAccessContext();
    if (!access.canRead) {
      throw new Error('Akses ditolak. Akun Anda belum diizinkan membuka aplikasi.');
    }
    return access;
  },

  requireReadAccess: function () {
    const access = this.getAccessContext();
    if (!access.canRead) {
      throw new Error('Akses baca ditolak.');
    }
    return access;
  },

  requireWriteAccess: function () {
    const access = this.getAccessContext();
    if (!access.canWrite) {
      throw new Error('Akses simpan ditolak. Hanya editor atau admin yang dapat mengubah data.');
    }
    return access;
  },

  requireAdminAccess: function () {
    const access = this.getAccessContext();
    if (!access.isAdmin) {
      throw new Error('Akses admin diperlukan untuk aksi ini.');
    }
    return access;
  },

  getAccessContext: function () {
    const requestAccess = RequestContext.getAccessContext();
    if (requestAccess) {
      return requestAccess;
    }

    const email = this.tryGetCurrentUserEmail_();
    const adminEmails = this.getEmailList_(APP_CONFIG.propertyKeys.adminEmails);
    const editorEmails = this.getEmailList_(APP_CONFIG.propertyKeys.editorEmails);
    const viewerEmails = this.getEmailList_(APP_CONFIG.propertyKeys.viewerEmails);
    const allowedDomain = this.getAllowedDomain_();
    const isDevelopment = this.isDevelopmentMode_();
    const hasRestrictions = Boolean(
      adminEmails.length ||
      editorEmails.length ||
      viewerEmails.length ||
      allowedDomain
    );

    if (isDevelopment && !hasRestrictions) {
      return {
        email: email || 'local-dev@apps-script',
        isAdmin: true,
        canRead: true,
        canWrite: true,
        canDelete: true,
        canSeed: true
      };
    }

    if (!email) {
      throw new Error('Email pengguna tidak tersedia. Isi allowlist email/domain atau gunakan SCHOOL_APP_ENV=development untuk setup lokal.');
    }

    const isDomainUser = allowedDomain && email.split('@')[1] === allowedDomain;
    const isAdmin = adminEmails.indexOf(email) > -1;
    const isEditor = isAdmin || editorEmails.indexOf(email) > -1;
    const isViewer = isEditor || viewerEmails.indexOf(email) > -1 || Boolean(isDomainUser);

    return {
      email: email,
      isAdmin: isAdmin,
      canRead: isViewer,
      canWrite: isEditor,
      canDelete: isAdmin,
      canSeed: isAdmin && this.isSeedAllowed_()
    };
  },

  tryGetCurrentUserEmail_: function () {
    return (Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  },

  getEmailList_: function (propertyKey) {
    const raw = PropertiesService.getScriptProperties().getProperty(propertyKey) || '';
    return raw
      .split(',')
      .map(function (item) { return item.trim().toLowerCase(); })
      .filter(String);
  },

  getAllowedDomain_: function () {
    return (PropertiesService.getScriptProperties().getProperty(APP_CONFIG.propertyKeys.allowedDomain) || '')
      .trim()
      .toLowerCase();
  },

  isSeedAllowed_: function () {
    if (this.isDevelopmentMode_()) {
      return true;
    }
    return APP_CONFIG.security.allowSeedInProduction;
  },

  isDevelopmentMode_: function () {
    const environment = (PropertiesService.getScriptProperties().getProperty(APP_CONFIG.propertyKeys.appEnvironment) ||
      APP_CONFIG.security.environment || 'production').trim().toLowerCase();
    return environment !== 'production';
  }
};
