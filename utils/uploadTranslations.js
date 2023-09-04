const fs = require('fs');
const path = require('path');
const { tail, reduce, map, flatten, difference, split, concat } = require('lodash');
const { initializeSheetsAPI } = require('../services/spreadSheetClient')

async function uploadNewTranslations(args) {

  const {
    SPREADSHEET_ID,
    SHEET_RANGE,
    BASE_LANGUAGE,
    I18N_FOLDER_PATH,
    LANGUAGES,
  } = args;

  const sheets = await initializeSheetsAPI();

  // Read base language json and manipulate structure
  const content = fs.readFileSync(path.join(I18N_FOLDER_PATH, `locales/${BASE_LANGUAGE}.json`), 'utf-8');
  const baseTranslations = JSON.parse(content);


  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
  });

  const externalKeys = tail(data.values).map(([context, key]) => `${context}:${key}`);
  const localKeys = reduce(baseTranslations, (result, value, context) => {

    const keys = flatten(map(value, (value, key) => {
        if (typeof value === "string") {
            return `${context}:${key}`
        } else {
            return map(value, (_, nkey) => `${context}:${key}.${nkey}`)
        }
    }))

    return [
        ...result,
        ...keys,
    ]
  }, [])

  const newKeys = difference(localKeys, externalKeys)

  const sheetData = map(newKeys, (keyPair) => {
    const [context, keyRaw] = split(keyPair, ':');
    const [key, pluralizationKey] = split(keyRaw, '.');

    const baseValue = pluralizationKey 
    ? baseTranslations[context][key][pluralizationKey]
    : baseTranslations[context][key];

    const otherValues = map(tail(LANGUAGES), (code) => {
        try {
            const file = fs.readFileSync(path.join(I18N_FOLDER_PATH, `locales/${code}.json`), 'utf-8');
            const fileData = JSON.parse(file);
            return pluralizationKey 
                ? fileData[context][key][pluralizationKey]
                : fileData[context][key];
        } catch (e) {
            return "";
        }
    })

    const sheetKey = pluralizationKey ? `${key}.${pluralizationKey}` : key;
    
    return [context, sheetKey, baseValue, ...otherValues]
  });

  const updatedValues = concat(data.values, sheetData);

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'RAW',
    resource: { values: updatedValues }
  });
}

module.exports = {
  uploadNewTranslations
}