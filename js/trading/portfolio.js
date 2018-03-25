function renderPortfolio(data) {
    createTable(data);
    renderAggStats();
}

function createTable(data){
    /* Data from Firebase */
    // console.log(`In createTable: ${JSON.stringify(data)}`)
    var portfolioData = data;

    /* Create table and headers */
    var table = document.createElement("TABLE");
    table.border = "1";

    //Get the count of columns. fw is just the example, all fish have the same number of stat types
    //var columnCount = Object.keys(portfolioData.fw).length;

    //Add the header row.
    var row = table.insertRow(-1);
    // Create name header
    var headerCell = document.createElement("TH");
    headerCell.textContent = "Name";
    row.appendChild(headerCell);
    for (stat in portfolioData.fw) {
        var headerCell = document.createElement("TH");
        headerCell.textContent = stat;
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (fishType in portfolioData) {
        var name = getReadableName(fishType)
        // Check for not being avg, Avg, and value
        if(name !== undefined){
            // Check for owning at least one stock of that fish
            if (portfolioData[fishType].shares > 0) {
                row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.textContent = name;
                for (stat in portfolioData[fishType]) {
                    var cell = row.insertCell(-1);
                    cell.textContent = portfolioData[fishType][stat];
                }
            }
        }
    }

    var dvTable = document.getElementById("portfolio");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}

function renderAggStats(){
    updateCash();
    updateAvgValShares();
}

function updateCash(){
    var cash = JSON.parse( localStorage.getItem('cash'));
    var div = document.getElementById("cash");
    div.textContent = cash;
}

function updateAvgValShares(){
    var p = JSON.parse( localStorage.getItem('portfolio'));
    var div = document.getElementById("value");
    div.textContent = p.aggStats.value;

    div = document.getElementById("avg");
    div.textContent = p.aggStats.avg;

    div = document.getElementById("shares");
    div.textContent = p.aggStats.shares;
}


