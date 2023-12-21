let shouldStoreData = true;
async function storeData(qrData) {
  shouldStoreData = false;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "values": qrData
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://jqrscanner-production.up.railway.app/addData", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result)
      alert("saved")
      shouldStoreData = true
    })
    .catch(error => console.log('error', error));
}

function displayInfo(label, value) {
let resultElement = document.getElementById('result');
resultElement.innerHTML += `<p><strong>${label}:</strong> ${value}</p>`;
}

async function onScanSuccess(qrCodeMessage) {
const vcardSplit = qrCodeMessage.split("\n");

let firstName = "";
let lastName = "";
let company = "";
let email = "";

for (let index in vcardSplit) {
  let partInfo = vcardSplit[index].trim();
  const infoSplit = partInfo.split(":");

  if (infoSplit.length >= 2) {
    const key = infoSplit[0].trim();
    const value = infoSplit.slice(1).join(":").trim();

    console.log("Key:", key);
    console.log("Value:", value);

    if (key === "N;CHARSET=UTF-8") {
      console.log("Processing Name:", value);
      const nameSplit = value.split(";");
      console.log("Name Split:", nameSplit);
      if (nameSplit.length >= 2) {
        firstName = nameSplit[1];
        lastName = nameSplit[0];
      } else {
        lastName = nameSplit[0];
      }
    } else if (key === "ORG") {
      company = value;
    } else if (key === "EMAIL") {
      email = value;
    }
    else if (key.startsWith("ORG")) {
    company = value;
    }
  }
}

// Display relevant information
displayInfo("First Name", firstName);
displayInfo("Last Name", lastName);
displayInfo("Company", company);
displayInfo("Email", email);

// Save the data to a Google Sheet
if (shouldStoreData) {
  await storeData([firstName + " " + lastName, company, email]);
}

// Log information to the console for testing
console.log("First Name:", firstName);
console.log("Last Name:", lastName);
console.log("Company:", company);
console.log("Email:", email);
}

function onScanError(errorMessage) {
  //handle scan error
}

var html5QrcodeScanner = new Html5QrcodeScanner(
  "reader", {
    fps: 10,
    qrbox: 250
  });
html5QrcodeScanner.render(onScanSuccess, onScanError);