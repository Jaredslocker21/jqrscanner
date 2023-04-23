const {
    google
} = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const {
    config
} = require('dotenv')

config();

async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES
    });
    const authToken = await auth.getClient();
    return authToken;
}

async function getSpreadSheet({
    spreadsheetId,
    auth
}) {
    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
}

async function getSpreadSheetValues({
    spreadsheetId,
    auth,
    sheetName
}) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName
    });
    return res;
}

async function writeValueToSpreadsheet({ spreadsheetId, auth, range, rowData }) {
    const res = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [rowData]
        },
        auth
    })
}


module.exports = {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    writeValueToSpreadsheet
}