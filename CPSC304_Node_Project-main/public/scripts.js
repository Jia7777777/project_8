/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the TPH1 and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('TPH1');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/TPH1', {
        method: 'GET'
    });

    const responseData = await response.json();
    const TPH1Content = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    TPH1Content.forEach(user => {
        const row = tableBody.insertRow();      //create a new row
        user.forEach((field, index) => { 
            const cell = row.insertCell(index); //create a new cell
            cell.textContent = field;
        });
    });
}

// Fetches data from the TPH1 and displays it.
async function fetchAndDisplayFiltered() {
    const tableElement = document.getElementById('TPH1');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/TPH1', {
        method: 'GET'
    });

    const responseData = await response.json();
    const TPH1Content = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    TPH1Content.forEach(user => {
        const row = tableBody.insertRow();      //create a new row
        user.forEach((field, index) => { 
            const cell = row.insertCell(index); //create a new cell
            cell.textContent = field;
        });
    });
}

// This function initiates all data.
async function initiateAllData() {
    const response = await fetch("/initiate-data", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initiateResultMsg');
        messageElement.textContent = "All data are initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating data!");
    }
}

// Inserts new records into TPH1.
async function insertTPH(event) {
    event.preventDefault();
    const seatNumberValue = document.getElementById('insertSeatNumber').value;
    const cidValue = document.getElementById('insertcid').value;
    const paymentmethodValue = document.getElementById('dropdown_paymentmethod').value;
    const paymentlocationValue = document.getElementById('dropdown_paymentlocation').value;
    const emailValue = document.getElementById('insertEmail').value;
    const seatlocationValue = document.getElementById('dropdown_seatlocation').value;

    const response = await fetch('/insert-TPH', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            seatnumber: seatNumberValue,
            cid: cidValue,
            paymentmethod: paymentmethodValue,
            paymentlocation: paymentlocationValue,
            email: emailValue,
            // price: priceValue,
            seatlocation: seatlocationValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Inserts records from TPH1.
async function deleteFromTPH(event) {
    event.preventDefault();
    const seatNumberValue = document.getElementById('deleteSeatNumber').value;
    const cidValue = document.getElementById('deletecid').value;

    const response = await fetch('/delete-tickets', {
        method: 'POST', // Technically 'DELETE' but I delete data in the sense of updating the existing database.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seatnumber: seatNumberValue, cid: cidValue })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting data!";
    }
}

async function retrieveSoldSeatNumbers(event) {
    event.preventDefault();
    const titleValue = document.getElementById('concertTitle').value;

    const messageElement = document.getElementById('soldResultMsg');
    const list = document.getElementById('listOfUnsoldTickets');
    const button = document.getElementById('soldTickets');
    list.innerHTML = ''; 

    if (hideButton(button, list, messageElement) == 1) {
        return;
    }

    const response = await fetch('/get-unsold-seatInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: titleValue })
    });
    const responseData = await response.json();
    
    if (responseData.success && responseData.seatInfo) {
        messageElement.textContent = `Here are the tickets sold for ${titleValue}:`;
        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const headers = ['Seat Number', 'Location'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
            headerCell.style.borderRight = '1px solid black';
        });

        table.appendChild(headerRow);

        responseData.seatInfo.forEach(({ seatnumber, seatlocation }) => {
            const row = document.createElement('tr');

            const seatNumberCell = document.createElement('td');
            seatNumberCell.textContent = seatnumber;
            seatNumberCell.style.borderRight = '1px solid black';

            const seatLocationCell = document.createElement('td');
            seatLocationCell.textContent = seatlocation;
            seatLocationCell.style.borderRight = '1px solid black';

            row.appendChild(seatNumberCell);
            row.appendChild(seatLocationCell);
            table.appendChild(row);
        });

        list.appendChild(table);
        list.style.display="block";
    } else {
        messageElement.textContent = "Error retrieving data!";
    }
}

async function retrieveTheNumberOfTicketsSoldForConcert(event) {
    event.preventDefault();

    const messageElement = document.getElementById('retrieveResultMsg');
    const list = document.getElementById('listOfTheNumberOfTickets');
    const button = document.getElementById('retrieveTheNumberOfTickets');
    list.innerHTML = ''; 

    if (hideButton(button, list, messageElement) == 1) {
        return;
    }

    const response = await fetch('/aggregation-with-group-by', {
        method: 'GET'
    });

    const responseData = await response.json();

    if (responseData.success) {
        messageElement.textContent = `Here is the number of tickets sold for each concert:`;

        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const headers = ['Concert Title', 'Number of Tickets Sold'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
            headerCell.style.borderRight = '1px solid black';
        });

        table.appendChild(headerRow);

        responseData.info.forEach(({ title, count }) => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = title;
            titleCell.style.borderRight = '1px solid black';

            const countCell = document.createElement('td');
            countCell.textContent = count;
            countCell.style.borderRight = '1px solid black';

            row.appendChild(titleCell);
            row.appendChild(countCell);
            table.appendChild(row);
        });

        list.appendChild(table);
        list.style.display = "block";
    } else {
        messageElement.textContent = "There is no concert in the system!";
    }
}

async function retrieveAudienceWhoHaveBoughtTickets(event) {
    event.preventDefault();

    const messageElement = document.getElementById('retrieveAudienceResultMsg');
    const list = document.getElementById('listOfAudience');
    const button = document.getElementById('retrieveAudience');
    list.innerHTML = ''; 
    
    if (hideButton(button, list, messageElement) == 1) {
        return;
    }
    

    const response = await fetch('retrieve-audiences-who-have-bought-tickets', {
        method: 'GET'
    });

    const responseData = await response.json();
    if (responseData.success && responseData.info) {
        messageElement.textContent = `Here are the audience who have bought tickets:`;

        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const headers = ['Email', 'Number of Tickets Bought'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
            headerCell.style.borderRight = '1px solid black';
        });

        table.appendChild(headerRow);

        responseData.info.forEach(({ email, count }) => {
            const row = document.createElement('tr');

            const emailCell = document.createElement('td');
            emailCell.textContent = email;
            emailCell.style.borderRight = '1px solid black';

            const countCell = document.createElement('td');
            countCell.textContent = count;
            countCell.style.borderRight = '1px solid black';

            row.appendChild(emailCell);
            row.appendChild(countCell);
            table.appendChild(row);
        });

        list.appendChild(table);
        list.style.display = "block";
    } else {
        messageElement.textContent = "Error retrieving data!";
    }
}

async function retrieveAudienceWhoHaveGoToEveryConcert(event) {
    event.preventDefault();

    const messageElement = document.getElementById('joinResultMsg');
    const list = document.getElementById('listOfAudienceJoined');
    const button = document.getElementById('join');
    list.innerHTML = ''; 
    
    if (hideButton(button, list, messageElement) == 1) {
        return;
    }
    

    const response = await fetch('retrive-audience-who-have-go-to-every-concert', {
        method: 'GET'
    });

    const responseData = await response.json();
    if (responseData.success) {
        messageElement.textContent = `Here are the audience who attend every concerts:`;

        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const headers = ['Email', 'Number of Tickets Bought'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
            headerCell.style.borderRight = '1px solid black';
        });

        table.appendChild(headerRow);

        responseData.info.forEach(({ email, name }) => {
            const row = document.createElement('tr');

            const emailCell = document.createElement('td');
            emailCell.textContent = email;
            emailCell.style.borderRight = '1px solid black';

            const nameCell = document.createElement('td');
            nameCell.textContent = name;
            nameCell.style.borderRight = '1px solid black';

            row.appendChild(emailCell);
            row.appendChild(nameCell);
            table.appendChild(row);
        });

        list.appendChild(table);
        list.style.display = "block";
    } else {
        messageElement.textContent = "No audience attends every concerts!";
    }
}

// Updates names in the demotable.
async function updateTPH1(event) {
    event.preventDefault();

    const seatNumberValue = document.getElementById('updateSeatNumber').value;
    const cidValue = document.getElementById('updatecid').value;
    let emailValue = document.getElementById('updateEmail').value;
    let paymentmethodValue = document.getElementById('update_dropdown_paymentmethod').value;
    let paymentlocationValue = document.getElementById('update_dropdown_paymentlocation').value;
    let seatlocationValue = document.getElementById('update_dropdown_seatlocation').value;

    const table = document.getElementById('TPH1');
    const rows = table.querySelectorAll('tbody tr');
    for (const row of rows) {
        const cells = row.getElementsByTagName('td');
        if (cells[0].textContent === seatNumberValue && cells[1].textContent === cidValue) {
            if (emailValue === "") {
                emailValue = cells[4].textContent;
            }
            if (paymentmethodValue === "default") {
                paymentmethodValue = cells[2].textContent;
            }
            if (paymentlocationValue === "default") {
                paymentlocationValue = cells[3].textContent;
            }
            if (seatlocationValue === "default") {
                seatlocationValue = cells[5].textContent;
            }
            break;
        }
    }

    const response = await fetch('/update-tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            seatnumber: seatNumberValue,
            cid: cidValue,
            paymentmethod: paymentmethodValue,
            paymentlocation: paymentlocationValue,
            email: emailValue,
            seatlocation: seatlocationValue
        })
    });

    const messageElement = document.getElementById('updateTPH1ResultMsg');
    const responseData = await response.json();
    if (responseData.success) {
        messageElement.textContent = "Data updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating data!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

//parse the text segmeents we got from the HTML form to a complete string
function parseHTMtoString(HTMLdata) {
    let parsedString = "";
    for (const frag of HTMLdata) {
        if (frag.value !== "")
            if (frag.value.includes("number")) {
                parsedString += frag.value.split("_")[1] + " ";
            } else if (frag.value.includes("string")) {
                parsedString += `'${frag.value.split("_")[1]}' `;
            } else {
                parsedString += frag.value + " ";
            }
    }
    console.log(parsedString);
    return parsedString;
}

function createAggregateDropdownOptions(dropdown) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "";
    dropdown.appendChild(defaultOption);

    const optionAnd = document.createElement("option");
    optionAnd.value = "AND";
    optionAnd.text = "AND";
    dropdown.appendChild(optionAnd);

    const optionOr = document.createElement("option");
    optionOr.value = "OR";
    optionOr.text = "OR";
    dropdown.appendChild(optionOr);
}

function createOperationDropdownOptionsString(dropdown) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "";
    dropdown.appendChild(defaultOption);

    const optionEQ = document.createElement("option");
    optionEQ.value = "string_=";
    optionEQ.text = "equals";
    dropdown.appendChild(optionEQ);

    const optionIncludes = document.createElement("option");
    optionIncludes.value = "string_LIKE";
    optionIncludes.text = "include";
    dropdown.appendChild(optionIncludes);
}

function createOperationDropdownOptionsNumber(dropdown) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "";
    dropdown.appendChild(defaultOption);

    const optionGT = document.createElement("option");
    optionGT.value = "number_>";
    optionGT.text = ">";
    dropdown.appendChild(optionGT);

    const optionGTEQ = document.createElement("option");
    optionGTEQ.value = "number_>=";
    optionGTEQ.text = ">=";
    dropdown.appendChild(optionGTEQ);

    const optionLT = document.createElement("option");
    optionLT.value = "number_<";
    optionLT.text = "<";
    dropdown.appendChild(optionLT);

    const optionLTEQ = document.createElement("option");
    optionLTEQ.value = "number_<=";
    optionLTEQ.text = "<=";
    dropdown.appendChild(optionLTEQ);
    
    const optionEQ = document.createElement("option");
    optionEQ.value = "number_=";
    optionEQ.text = "=";
    dropdown.appendChild(optionEQ);
}


function createColumnDropdownOptions(dropdown) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "";
    dropdown.appendChild(defaultOption);

    const sn = document.createElement("option");
    sn.value = "seatNumber";
    sn.text = "seatNumber";
    dropdown.appendChild(sn);

    const cid = document.createElement("option");
    cid.value = "cid";
    cid.text = "cid";
    dropdown.appendChild(cid);

    const pm = document.createElement("option");
    pm.value = "paymentmethod";
    pm.text = "paymentmethod";
    dropdown.appendChild(pm);

    const pl = document.createElement("option");
    pl.value = "paymentlocation";
    pl.text = "paymentlocation";
    dropdown.appendChild(pl);
    
    const e = document.createElement("option");
    e.value = "email";
    e.text = "email";
    dropdown.appendChild(e);

    const sl = document.createElement("option");
    sl.value = "seatlocation";
    sl.text = "seatlocation";
    dropdown.appendChild(sl);
}

function deleteAfterIdx(filterList, start) {
    console.log(filterList);
    console.log(start);
    //delete all the dropdown and textboxes after this
    for (let i=filterList.children.length-1; i>start; i--) {
        //delete at this position for length-start times
        filterList.removeChild(filterList.lastElementChild);
    }
}

function generateRecommendedValueForColumn(columnId) {
    const colName = document.getElementById(columnId).value;
    if (colName === 'seatNumber') {
        return 'Enter seatnumber (0-999)';
    } else if (colName === 'cid') {
        return 'Enter cid (1-5)';
    } else if (colName === 'paymentmethod') {
        return 'Enter paymentmethod (Credit/Debit)';
    } else if (colName === 'paymentlocation') {
        return 'Enter paymentlocation (Online/Offline)';
    } else if (colName === 'email') {
        return 'Enter email (e.g. 123456@gmail.com)';
    } else if (colName === 'seatlocation') {
        return 'Enter seatlocation (Courtside/Suite/Middle Bowl/Lower Bowl)';
    }
    return 'Error!';
}


function addInputBox(filterList, index) {
    const newInput = document.createElement("input");
    newInput.required = true;
    newInput.id = `input_${index}`;
    newInput.type = "text";
    newInput.placeholder = generateRecommendedValueForColumn(`column_${index-2}`);
    filterList.appendChild(newInput);
}

function addAggregate(filterList, index) {
    const newDropdown = document.createElement("select");
    newDropdown.addEventListener("change", processAggregate);
    newDropdown.id = `aggregate_${index+1}`;
    createAggregateDropdownOptions(newDropdown);
    filterList.appendChild(newDropdown);
}

//add operation dropdown box
function addColumn(index, choice) {
    const newDropdown = document.createElement("select");
    newDropdown.id = `operation_${index}`;
    newDropdown.required = true;
    newDropdown.addEventListener("change", processOperation);
    //add the dropdown box based on the type of selected column
    if (["paymentmethod", "paymentlocation", "email", "seatlocation"].includes(choice))
        createOperationDropdownOptionsString(newDropdown);
    else
        createOperationDropdownOptionsNumber(newDropdown);
    return newDropdown;
}

async function processAggregate(currDropdown) {
    const filterList = document.getElementById("filterList");
    const choice = currDropdown.target.value;
    const index = filterList.children.length;
    if(choice !== "" && currDropdown.target === filterList.lastElementChild) {    //the dropdown is selected with a value
        const newDropdown = document.createElement("select");
        newDropdown.id = `column_${index}`;
        newDropdown.required = true;
        newDropdown.addEventListener("change", processColumn);
        createColumnDropdownOptions(newDropdown);
        filterList.appendChild(newDropdown);
    } else if (currDropdown.target.value === "") {
        const start = Number(currDropdown.target.id.split("_")[1]);
        deleteAfterIdx(filterList, start);
    };
}

async function processOperation(currDropdown) {
    const filterList = document.getElementById("filterList");
    const choice = currDropdown.target.value;
    const index = filterList.children.length;
    if(choice !== "" && currDropdown.target === filterList.lastElementChild) {    //the dropdown is selected with a value
        addInputBox(filterList, index);
        addAggregate(filterList, index);
    } else if (currDropdown.target.value === "") {
        const start = Number(currDropdown.target.id.split("_")[1]);
        deleteAfterIdx(filterList, start);
    };
}

//handles the dropdown to select table columns
async function processColumn(currDropdown) {
    const filterList = document.getElementById("filterList");
    console.log(filterList);
    const choice = currDropdown.target.value;
    const index = filterList.children.length;
    if(choice !== "" && currDropdown.target === filterList.lastElementChild) {    //the dropdown is selected with a value
        const newDropdown = addColumn(index, choice);
        filterList.appendChild(newDropdown);
    } else if (choice !== "" && currDropdown.target !== filterList.lastElementChild) { //if you select another column with another type
        const copiedIndex = Number(currDropdown.target.id.split("_")[1]);
        const inputBox = document.getElementById(`input_${copiedIndex+2}`);
        inputBox.placeholder = generateRecommendedValueForColumn(`column_${copiedIndex}`);
        const newDropdown = addColumn(copiedIndex, choice);
        filterList.replaceChild(newDropdown, filterList.children[copiedIndex+1]);
    } else if (currDropdown.target.value === "") {
        const start = Number(currDropdown.target.id.split("_")[1]);
        deleteAfterIdx(filterList, start);
    };
}

async function selectTPH() {
    event.preventDefault();
    const data = document.getElementById("filterList");
    const parsedString = parseHTMtoString(data.children);
    const response = await fetch('/selectTPH', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parsedString: parsedString
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('selectResultMsg');
    if (responseData.success) {
        messageElement.textContent = "Filtered data shown below: ";
        displayFilteredData(responseData.filteredResult, 'filteredResult');
    } else {
        messageElement.textContent = "Errors contained in the input data!";
    }
}

function displayHeader(tableElement, len) {
    const thead = tableElement.querySelector("thead");
    thead.innerHTML = "";

    //if there are filtered results, then diaplay the header
    if (len !== 0)
        thead.innerHTML += `
            <tr>
                <th>seatnumber</th>
                <th>cid</th>
                <th>paymentmethod</th>
                <th>paymentlocation</th>
                <th>email</th>
                <th>seatlocation</th>
            </tr>
        `
}

function displayAvgHeader(tableElement, len) {
    const thead = tableElement.querySelector("thead");
    thead.innerHTML = "";

    //if there are filtered results, then diaplay the header
    if (len !== 0)
        thead.innerHTML += `
        <div style="height: 400px; overflow-y: auto;">
            <tr>
                <th>email</th>
            </tr>
        </div>
        `
}

function displayFilteredData(list, id) {
    const tableElement = document.getElementById(id);
    const tableBody = tableElement.querySelector('tbody');
    const filteredDiv = document.getElementById("filteredDiv");
    
    //display the header columns
    if (id === 'listOfFilteredAverage') {
        displayAvgHeader(tableElement, list.length);
    } else {
        displayHeader(tableElement, list.length);
    }

    //display the body info
    tableBody.innerHTML = "";                   //clear the outdated rows
    list.forEach(r => {
        const row = tableBody.insertRow();      //create a new row
        r.forEach((c, index) => { 
            const cell = row.insertCell(index); //create a new cell
            cell.textContent = c;
        });
    });
    filteredDiv.style.display = "block";
}

function displayProjectHeader(tableElement, len, columnList) {
    const thead = tableElement.querySelector("thead");
    thead.innerHTML = "";
    console.log(columnList);
    //if there are filtered results, then diaplay the header
    //the header columns are dynamically created
    if (len !== 0) {
        const head = thead.insertRow();
        columnList.forEach((c, index) => {
            const cell = head.insertCell(index);
            cell.textContent = c;
        });
    }
}

function displayProjectionData(resultList, columnList) {
    const tableElement = document.getElementById('projectResult');
    const tableBody = tableElement.querySelector('tbody');
    
    //display the header columns
    displayProjectHeader(tableElement, resultList.length, columnList);

    //display the body info
    tableBody.innerHTML = "";                   //clear the outdated rows
    resultList.forEach(r => {
        const row = tableBody.insertRow();      //create a new row
        r.forEach((c, index) => { 
            const cell = row.insertCell(index); //create a new cell
            cell.textContent = c;
        });
    });
}

async function projectConcert() {
    event.preventDefault();
    const messageElement = document.getElementById('projectMessage');
    const rawData = document.getElementById("projectionConcert").querySelectorAll('input:checked');
    
    //force the user to choose at least 1 column
    if (rawData.length === 0) {
        messageElement.textContent = "You must choose at least 1 column to see results.";
        displayProjectionData([], []);
        return;
    }

    //parse the checkbox results into a string
    let columnString = "";
    const columnList = []
    for (let i=0; i<rawData.length; i++) {
        columnString += rawData[i].value;
        columnList.push(rawData[i].value);
        if (i !== rawData.length - 1)
            columnString += ", "
    }

    //GET cannot use a body so I pass the string as a parameter
    const response = await fetch(`/projectConcert?columnString=${encodeURIComponent(columnString)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();
    if (responseData.success) {
        messageElement.textContent = "Here is your customized result: ";
        displayProjectionData(responseData.projectResult, columnList);
    } else {
        messageElement.textContent = "Errors occured";
    }
}

async function filterAvgPrice() {
    const messageElement = document.getElementById('filterAverageResultMsg');
    const list = document.getElementById('listOfFilteredAverage');
    const button = document.getElementById('filterAverage');

    if (hideButton(button, list, messageElement) == 1) {
        return;
    }
    
    const response = await fetch('/filterAvgPrice', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    if (data.success) {
        messageElement.textContent = `Here are the results:`;

        const table = document.createElement('table');
        table.style.border = '1px solid black';

        const headers = ['Email'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
            headerCell.style.borderRight = '1px solid black';
        });

        table.appendChild(headerRow);

        data.result.forEach(email => {
            const row = document.createElement('tr');

            const emailCell = document.createElement('td');
            emailCell.textContent = email;
            emailCell.style.borderRight = '1px solid black';

            row.appendChild(emailCell);
            table.appendChild(row);
        });

        list.appendChild(table);
        list.style.display = "block";
    } else {
        messageElement.textContent = "";
    }


}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("initiateAllData").addEventListener("click", initiateAllData);
    document.getElementById("insertTPH").addEventListener("submit", insertTPH);
    document.getElementById("deleteFromTPH").addEventListener("submit", deleteFromTPH);
    document.getElementById("soldFromTPH").addEventListener("submit", retrieveSoldSeatNumbers);
    document.getElementById("updataTPH1").addEventListener("submit", updateTPH1);
    document.getElementById("selectTPH").addEventListener("submit", selectTPH);
    document.getElementById("column_0").addEventListener("change", processColumn);
    document.getElementById("retrieveTheNumberOfTickets").addEventListener("click", retrieveTheNumberOfTicketsSoldForConcert);
    document.getElementById("retrieveAudience").addEventListener("click", retrieveAudienceWhoHaveBoughtTickets);
    document.getElementById("projectionConcert").addEventListener("submit", projectConcert);
    document.getElementById("join").addEventListener("click", retrieveAudienceWhoHaveGoToEveryConcert);
    document.getElementById("filterAverage").addEventListener("click", filterAvgPrice);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

function hideButton(button, list, messageElement) {
    if (messageElement.style.display === 'none') {
        messageElement.style.display = 'block';
        button.style.background = "red";
        button.textContent = 'Hide';
        return 0;
    } else {
        messageElement.style.display = 'none';
        list.style.display = "none";
        button.textContent = 'Retrieve';
        button.style.background = "#3304aa";
        return 1;
    }
}