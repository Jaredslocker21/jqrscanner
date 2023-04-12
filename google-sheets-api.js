// Load the Google Sheets API library
gapi.load('client', function() {
    // Initialize the API client with your OAuth client ID and secret
    gapi.client.init({
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(function() {
      // Authenticate the user
      return gapi.auth2.getAuthInstance().signIn();
    }).then(function() {
      // Define the spreadsheet and sheet you want to write to
      var spreadsheetId = 'YOUR_SPREADSHEET_ID';
      var sheetName = 'YOUR_SHEET_NAME';
      var sheetRange = sheetName + '!A1:C1';
      // Define the data to write
      var qrCodeMessage = document.getElementById('result').innerHTML;
      var rowData = [qrCodeMessage, new Date().toString()];
      // Append the data to the sheet
      return gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetRange,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData]
        }
      });
    }).then(function(response) {
      console.log('Row added to sheet:', response);
    }, function(reason) {
      console.error('Error adding row to sheet:', reason.result.error.message);
    });
  });