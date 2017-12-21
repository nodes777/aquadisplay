function initPortfolio() {

    createTable();
    updateCash();
	

}

function updateCash(){
    var cash = JSON.parse( localStorage.getItem('cash'));
    var div = document.getElementById("cash");
    div.innerHTML = cash;
}

function createTable(){
    /* Get localStorage */
    var portfolioData = JSON.parse( localStorage.getItem('portfolio'));
    console.log(portfolioData);

    /* Create table and headers */
    var table = document.createElement("TABLE");
    table.border = "1";

    //Get the count of columns. fw is just the example, all fish have the same number of stat types
    //var columnCount = Object.keys(portfolioData.fw).length;

    //Add the header row.
    var row = table.insertRow(-1);
    // Create name header
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Name";
    row.appendChild(headerCell);
    for (stat in portfolioData.fw) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = stat;
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
                cell.innerHTML = name;
                for (stat in portfolioData[fishType]) {
                    var cell = row.insertCell(-1);
                    cell.innerHTML = portfolioData[fishType][stat];
                }
            }
        }
    }

    var dvTable = document.getElementById("portfolio");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}