const path = require('path');
const { downloadTranslations } = require('./utils/downloadTranslations')
const { uploadNewTranslations } = require('./utils/uploadTranslations')

const LANGUAGES = []; // list of language codes. Eg. ["et", "en"]

const BASE_LANGUAGE = LANGUAGES[0];

const I18N_FOLDER_PATH = path.join(__dirname, '') // update with the "" with the location of your apps i18n folder

const SPREADSHEET_ID = ""; // the ID of your Google sheet. Can be copied from the sheet url

const SHEET_RANGE = "" // the name of the translations sheet. You can find it at the bottom of the sheets tab. "Eg. Sheet1"

const ENV = {
  BASE_LANGUAGE,
  I18N_FOLDER_PATH,
  SPREADSHEET_ID,
  SHEET_RANGE,
  LANGUAGES,
}

async function sync () {
  await uploadNewTranslations(ENV)
  await downloadTranslations(ENV)
}

sync().catch(console.error);