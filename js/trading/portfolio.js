function renderPortfolio(data) {
    createTable(data);
    renderAggStats(data);
}

function createTable(data){
    var statsList = ["Shares", "Quote", "Value", "Paid", "Dollar Change", "Percent Change", "Weight"];
    var portfolioData = data;

    /* Create table and headers */
    var table = document.createElement("TABLE");
    table.border = "1";

    //Add the header row.
    var row = table.insertRow(-1);
    // Create name header
    var headerCell = document.createElement("TH");
    headerCell.textContent = "Name";
    headerCell.setAttribute("scope","col")
    row.appendChild(headerCell);

    // For each stat, add another header cell
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
        let arr = [p.shares, p.quote, p.value, p.paid, p.dollarChange, p.percentChange, p.weight]
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

    var divTable = document.getElementById("portfolio");
    divTable.innerHTML = "";
    divTable.appendChild(table);
}

function renderAggStats(pData){
    let cashNum = pData.cash;
    let div = document.getElementById("cash");
    div.textContent = cashNum;

    let p = pData;
    div = document.getElementById("value");
    div.textContent = p.aggStats.value;

    div = document.getElementById("avg");
    div.textContent = p.aggStats.avg;

    div = document.getElementById("shares");
    div.textContent = p.aggStats.shares;
}



