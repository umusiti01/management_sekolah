const ValidationService = {
  validateAndNormalize: function (moduleKey, payload) {
    const moduleConfig = SCHOOL_MODULES[moduleKey];
    if (!moduleConfig) {
      throw new Error('Modul tidak dikenal: ' + moduleKey);
    }

    const normalized = this.normalizePayload_(moduleConfig, payload);
    this.validateRequiredFields_(moduleConfig, normalized);
    this.validateEnums_(moduleConfig, normalized);
    this.validateModuleSpecificRules_(moduleKey, normalized);
    this.validateUniqueness_(moduleKey, normalized);

    return normalized;
  },

  normalizePayload_: function (moduleConfig, payload) {
    const normalized = { ID: (payload.ID || '').trim() };
    moduleConfig.editableFields.forEach(function (field) {
      const value = payload[field];
      normalized[field] = typeof value === 'string' ? value.trim() : (value || '');
    });

    if (normalized['No HP']) {
      normalized['No HP'] = normalized['No HP'].replace(/\s+/g, '');
    }
    if (normalized.Email) {
      normalized.Email = normalized.Email.toLowerCase();
    }

    return normalized;
  },

  validateRequiredFields_: function (moduleConfig, payload) {
    moduleConfig.requiredFields.forEach(function (field) {
      if (!payload[field]) {
        throw new Error(field + ' wajib diisi.');
      }
    });
  },

  validateEnums_: function (moduleConfig, payload) {
    Object.keys(moduleConfig.enumFields || {}).forEach(function (field) {
      const allowedValues = moduleConfig.enumFields[field];
      if (payload[field] && allowedValues.indexOf(payload[field]) === -1) {
        throw new Error(field + ' tidak valid.');
      }
    });
  },

  validateModuleSpecificRules_: function (moduleKey, payload) {
    if (moduleKey === 'students' && !/^\d{4,20}$/.test(payload.NIS)) {
      throw new Error('NIS harus berupa angka 4-20 digit.');
    }

    if (moduleKey === 'teachers') {
      if (!/^\d{8,30}$/.test(payload.NIP)) {
        throw new Error('NIP harus berupa angka 8-30 digit.');
      }
      if (payload.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.Email)) {
        throw new Error('Email guru tidak valid.');
      }
    }

    if (moduleKey === 'classes') {
      if (payload.Kapasitas && (!/^\d+$/.test(payload.Kapasitas) || Number(payload.Kapasitas) <= 0)) {
        throw new Error('Kapasitas kelas harus berupa angka positif.');
      }
      if (!/^\d{4}\/\d{4}$/.test(payload['Tahun Ajaran'])) {
        throw new Error('Tahun ajaran harus berformat YYYY/YYYY.');
      }
    }

    if (moduleKey === 'announcements') {
      if (payload['Tanggal Publikasi'] && !/^\d{4}-\d{2}-\d{2}$/.test(payload['Tanggal Publikasi'])) {
        throw new Error('Tanggal publikasi harus berformat YYYY-MM-DD.');
      }
    }

    if (moduleKey === 'websiteSettings') {
      ['Hero Gambar', 'Hero CTA Link'].forEach(function (field) {
        if (payload[field] && !/^https?:\/\//i.test(payload[field]) && payload[field].charAt(0) !== '#') {
          throw new Error(field + ' harus berupa URL http/https atau anchor (#bagian).');
        }
      });

      if (payload.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.Email)) {
        throw new Error('Email website tidak valid.');
      }
    }
  },

  validateUniqueness_: function (moduleKey, payload) {
    const moduleConfig = SCHOOL_MODULES[moduleKey];
    const sheetConfig = APP_CONFIG.sheets[moduleConfig.sheetKey];
    const records = SheetRepository.findAllByModule(moduleKey);

    (moduleConfig.uniqueRules || []).forEach(function (rule) {
      const duplicate = records.find(function (record) {
        if (String(record.ID) === String(payload.ID || '')) {
          return false;
        }

        return rule.fields.every(function (field) {
          return String(record[field] || '').trim().toLowerCase() === String(payload[field] || '').trim().toLowerCase();
        });
      });

      if (duplicate) {
        throw new Error(rule.label + ' harus unik pada sheet ' + sheetConfig.name + '.');
      }
    });
  }
};
