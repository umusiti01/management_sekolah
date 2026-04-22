const SheetRepository = {
  findAllByModule: function (moduleKey) {
    return this.findAll(APP_CONFIG.sheets[SCHOOL_MODULES[moduleKey].sheetKey].name);
  },

  findById: function (moduleKey, id) {
    return this.findAllByModule(moduleKey).find(function (record) {
      return String(record.ID) === String(id);
    }) || null;
  },

  findAll: function (sheetName) {
    const sheet = SpreadsheetGateway.getSheetByName(sheetName);
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return [];
    }

    const headers = values[0];
    return values.slice(1).map(function (row) {
      return headers.reduce(function (record, header, index) {
        record[header] = row[index];
        return record;
      }, {});
    });
  },

  upsert: function (moduleKey, payload, actorEmail) {
    const sheetConfig = APP_CONFIG.sheets[SCHOOL_MODULES[moduleKey].sheetKey];
    const sheet = SpreadsheetGateway.getSheetByName(sheetConfig.name);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getDataRange().getValues();
    const id = payload.ID || AppUtilities.createId();
    const createdAtIndex = headers.indexOf('Tanggal Dibuat');
    const updatedAtIndex = headers.indexOf('Tanggal Diubah');
    const createdByIndex = headers.indexOf('Dibuat Oleh');
    const updatedByIndex = headers.indexOf('Diubah Oleh');
    const existingRowIndex = data.findIndex(function (row, index) {
      return index > 0 && String(row[0]) === String(id);
    });
    const existingRecord = existingRowIndex > -1
      ? headers.reduce(function (record, header, index) {
          record[header] = data[existingRowIndex][index];
          return record;
        }, {})
      : {};
    const nowIso = new Date().toISOString();

    const rowData = headers.map(function (header) {
      if (header === 'ID') {
        return id;
      }
      if (header === 'Tanggal Dibuat') {
        return existingRecord['Tanggal Dibuat'] || nowIso;
      }
      if (header === 'Tanggal Diubah') {
        return nowIso;
      }
      if (header === 'Dibuat Oleh') {
        return existingRecord['Dibuat Oleh'] || actorEmail;
      }
      if (header === 'Diubah Oleh') {
        return actorEmail;
      }
      if (Object.prototype.hasOwnProperty.call(payload, header)) {
        return payload[header];
      }
      return existingRecord[header] || '';
    });

    if (existingRowIndex > -1) {
      rowData[createdAtIndex] = data[existingRowIndex][createdAtIndex] || nowIso;
      if (createdByIndex > -1) {
        rowData[createdByIndex] = data[existingRowIndex][createdByIndex] || actorEmail;
      }
      sheet.getRange(existingRowIndex + 1, 1, 1, rowData.length).setValues([rowData]);
    } else {
      if (updatedAtIndex > -1) {
        rowData[updatedAtIndex] = nowIso;
      }
      if (createdByIndex > -1) {
        rowData[createdByIndex] = actorEmail;
      }
      if (updatedByIndex > -1) {
        rowData[updatedByIndex] = actorEmail;
      }
      sheet.appendRow(rowData);
    }

    return {
      id: id,
      headers: headers,
      rowData: rowData
    };
  },

  removeById: function (moduleKey, id) {
    const sheet = SpreadsheetGateway.getSheetByName(APP_CONFIG.sheets[SCHOOL_MODULES[moduleKey].sheetKey].name);
    const values = sheet.getDataRange().getValues();

    for (let row = 1; row < values.length; row += 1) {
      if (String(values[row][0]) === String(id)) {
        sheet.deleteRow(row + 1);
        return { success: true };
      }
    }

    throw new Error('Data dengan ID tersebut tidak ditemukan.');
  }
};
