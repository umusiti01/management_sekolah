const DatabaseInitializer = {
  initialize: function () {
    const spreadsheet = SpreadsheetGateway.getDatabaseSpreadsheet();

    Object.keys(APP_CONFIG.sheets).forEach((key) => {
      const sheetConfig = APP_CONFIG.sheets[key];
      this.ensureSheet(spreadsheet, sheetConfig.name, sheetConfig.headers);
    });
  },

  ensureSheet: function (spreadsheet, sheetName, headers) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#dbeafe');
      sheet.autoResizeColumns(1, headers.length);
      return;
    }

    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missingHeaders = headers.filter(function (header) {
      return existingHeaders.indexOf(header) === -1;
    });

    if (missingHeaders.length > 0) {
      sheet.getRange(1, existingHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
      sheet.getRange(1, 1, 1, existingHeaders.length + missingHeaders.length)
        .setFontWeight('bold')
        .setBackground('#dbeafe');
      sheet.autoResizeColumns(1, existingHeaders.length + missingHeaders.length);
    }
  }
};

const SpreadsheetGateway = {
  getDatabaseSpreadsheet: function () {
    const properties = PropertiesService.getScriptProperties();
    let spreadsheetId = properties.getProperty(APP_CONFIG.propertyKeys.spreadsheetId);
    let spreadsheet;

    if (spreadsheetId) {
      try {
        spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      } catch (error) {
        throw new Error(
          'Spreadsheet database tidak dapat dibuka. Periksa property ' +
          APP_CONFIG.propertyKeys.spreadsheetId +
          ' atau pulihkan file spreadsheet yang terhapus.'
        );
      }
    } else {
      AuthService.requireAdminAccess();
      spreadsheet = SpreadsheetApp.create(APP_CONFIG.spreadsheetName);
      properties.setProperty(APP_CONFIG.propertyKeys.spreadsheetId, spreadsheet.getId());
    }

    return spreadsheet;
  },

  getSheetByName: function (sheetName) {
    DatabaseInitializer.initialize();
    const sheet = this.getDatabaseSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet tidak ditemukan: ' + sheetName);
    }
    return sheet;
  }
};
