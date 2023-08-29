# README for i18n-translation-sync

## Description

This application syncs i18n locales translations between your application and a Google Sheet.

## File Structure

```
.
├── README.md
├── keys
│   └── credentials.json
├── package.json
├── services
│   └── spreadSheetClient.js
├── sync.example.js
├── utils
│   ├── downloadTranslations.js
│   └── uploadTranslations.js
└── yarn.lock
```

## Requirements

- Node.js
- Google Account
- Google Sheet with translations

## Setup

### Google Service Account

1. Go to the Google Cloud Console and create a new project.
2. Enable the Google Sheets API and Google Drive API for the project.
3. Create a Service Account and download the JSON key file.
4. Place the downloaded `credentials.json` inside the `keys` folder

## Google Sheet Setup

### Creating the Sheet

1. Create a new Google Sheet.
2. Add the following columns in the first row:

    ```
    context | key | ...languages
    ```

   Replace `...languages` with the language codes relevant to your application, for example `en`, `fr`, etc.

### Data Format

The Google Sheet should be structured to support both single and plural translations.

#### Single Translations

For single translations, you can simply add a row with the context, the key, and the translation in each language column. 

#### Plural Translations

The script handles pluralization by breaking down the plural forms into separate rows in the Google Sheet. The keys for pluralized words will be joined with the respective pluralization key (`one`, `other`, etc.).

#### Example

For a JSON structure like this:

```json
{
  "greeting": {
    "hello": "Hello",
    "how_are_you": {
      "one": "How are you",
      "other": "How are You"
    }
  }
}
```

The sheet should look like this:

```
context       | key           | en         | ... other languages
greeting      | hello         | Hello      | ...
how_are_you   | how_are_you.one | How are you | ...
how_are_you   | how_are_you.other | How are You | ...
```

### Sync Back

When the script runs, it will convert the Google Sheet rows back to the original JSON format, handling both single and plural translations.

Remember to grant the Google Service Account email (found in your `credentials.json`) access to the Google Sheet to make this work.

## Translation Script Configuration

1. Copy `sync.example.js` to a new file, for example `sync.myapp.js`.
2. Open `sync.myapp.js` and update the environment variables:

```javascript
const LANGUAGES = []; // List of language codes. Eg. ["et", "en"]
const BASE_LANGUAGE = LANGUAGES[0];
const I18N_FOLDER_PATH = path.join(__dirname, ''); // Location of your app's i18n folder
const SPREADSHEET_ID = ""; // Google Sheet ID
const SHEET_RANGE = ""; // Name of the sheet tab. Eg. "Sheet1"

const ENV = {
  BASE_LANGUAGE,
  I18N_FOLDER_PATH,
  SPREADSHEET_ID,
  SHEET_RANGE,
  LANGUAGES,
};
```

Note: The script expects the locale files to reside in a `/locales` folder inside your specified i18n folder.

### NPM Script (Optional)

To simplify script execution, add a custom script to your `package.json`:

```json
"scripts": {
  "myapp": "node sync.myapp.js"
}
```

Now, you can run the script with `yarn myapp` or `npm run myapp`.

## Usage

Run the script:

```bash
node sync.myapp.js
```

Or if you added the npm script:

```bash
yarn myapp
```

or

```bash
npm run myapp
```

This will sync your i18n locales with the specified Google Sheet.

## Contributing

Please read the contributing guidelines for details on code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.

## Support

For support, please email [arnold@appit.ee](mailto:arnold@appit.ee) or raise an issue in the GitHub repository.


