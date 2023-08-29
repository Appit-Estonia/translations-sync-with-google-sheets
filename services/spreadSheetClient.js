const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function authorize() {
  const content = fs.readFileSync(path.join(__dirname, '../keys/credentials.json'), 'utf-8');
  const credentials = JSON.parse(content);

  // Extract necessary values from your credentials
  const { client_email, private_key } = credentials;

  // Create a JWT client for authentication
  const jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // Authorize the client
  await jwtClient.authorize();
  return jwtClient;
}

async function initializeSheetsAPI() {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

module.exports = {
  authorize,
  initializeSheetsAPI
}