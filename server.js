const {
    getAuthToken,
    writeValueToSpreadsheet
} = require('./googleSheets.js');
const { writeFileSync } = require("fs");
const express = require("express");
const cors = require("cors")
const {
    config
} = require('dotenv')

config();

const GC_CREDS = process.env.CREDS;

writeFileSync('./creds.json', GC_CREDS);


const spreadsheetId = process.env.SHEET_ID;
//   const sheetName = "Attendees";

async function createRow(data) {
    try {
        const auth = await getAuthToken();
        const response = await writeValueToSpreadsheet({
            spreadsheetId,
            auth,
            range: '!A1:C1',
            rowData: data
        })
    } catch (error) {
        console.log(error.message, error.stack);
    }
}

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hellllooo!!!")
})

app.post('/addData', async (req, res) => {
    await createRow(req.body.values);
    res.send("OK!")
})

const port = process.env.PORT ?? 3221

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })