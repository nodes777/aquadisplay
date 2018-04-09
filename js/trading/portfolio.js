function renderPortfolio(data) {
    createTable(data);
    renderAggStats(data);
}

function createTable(data){
    var statsList = ["Shares", "Paid", "Quote", "Dollar Change", "Percent Change", "Value", "Weight"]
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
    headerCell.setAttribute("scope","col")
    row.appendChild(headerCell);
    statsList.forEach(function(stat) {
        headerCell = document.createElement("TH");
        headerCell.setAttribute("scope","col")
        headerCell.textContent = stat;
        row.appendChild(headerCell);
    })

    //Add the data rows.
    // Sort the stats to match up with the table headers, order isnt guaranteed in JSON.
    for (fishType in portfolioData) {
        let p = portfolioData[fishType];
        let arr = [p.shares, p.paid, p.quote, p.dollarChange, p.percentChange, p.value, p.weight,]
        var name = getReadableName(fishType)
        // Check for not being avg, Avg, and value
        if(name !== undefined){
            // Check for owning at least one stock of that fish
            if (portfolioData[fishType].shares > 0) {
                row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.setAttribute("scope","row")
                cell.textContent = name;
                arr.forEach(function(stat){
                    var cell = row.insertCell(-1);
                    cell.textContent = stat;
                })
            }
        }
    }

    var dvTable = document.getElementById("portfolio");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}

function renderAggStats(pData){
    updateCash(pData);
    updateAvgValShares(pData);
}

function updateCash(pData){
    var cash = pData.cash;
    var div = document.getElementById("cash");
    div.textContent = cash;
}

function updateAvgValShares(pData){
    var p = pData;
    var div = document.getElementById("value");
    div.textContent = p.aggStats.value;

    div = document.getElementById("avg");
    div.textContent = p.aggStats.avg;

    div = document.getElementById("shares");
    div.textContent = p.aggStats.shares;
}


