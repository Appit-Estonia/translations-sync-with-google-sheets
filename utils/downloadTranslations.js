const fs = require('fs');
const path = require('path');
const { split } = require('lodash');
const { initializeSheetsAPI } = require('../services/spreadSheetClient')

async function downloadTranslations(args) {
  const {
    SPREADSHEET_ID,
    SHEET_RANGE,
    I18N_FOLDER_PATH,
    LANGUAGES,
  } = args;

  const sheets = await initializeSheetsAPI()

  // Fetch data from Google Sheet
  const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
  });

  const values = data.values || [];
  const translations = {};

  // Create/update other language files based on Google Sheet
  for (const lang of LANGUAGES) {
      translations[lang] = {};
  }

  for (const [context, key, ...translationsArray] of values.slice(1)) {
      for (let i = 0; i < LANGUAGES.length; i++) {
          if (!translations[LANGUAGES[i]][context]) {
              translations[LANGUAGES[i]][context] = {};
          }
          const [tKey, tPlural] = split(key, '.');
          if (tPlural) {
              if (!translations[LANGUAGES[i]][context][tKey]) {
                  translations[LANGUAGES[i]][context][tKey] = {};
              }
              translations[LANGUAGES[i]][context][tKey][tPlural] = translationsArray[i] || "";
          } else {
              translations[LANGUAGES[i]][context][tKey] = translationsArray[i] || "";
          }
      }
  }

  for (const [lang, data] of Object.entries(translations)) {
      fs.writeFileSync(path.join(I18N_FOLDER_PATH, `locales/${lang}.json`), JSON.stringify(data, null, 2), 'utf-8');
  }
}

module.exports = {
  downloadTranslations
}