# AquaDisplay

[AquaDisplay](http://taylornodell.com/aquadisplay/) displays the data from the [aquascraper](https://github.com/nodes777/aquascraper). The scraper gathers data from the [closed auction page](http://www.aquabid.com/cgi-bin/auction/closed.cgi) of [aquabid.com](http://www.aquabid.com/). It grabs the data from a Firebase database and formats the d3 charts. The Firebase is updated each day at 12:30am PST.

Data is publicly available with instructions on how to obtain on the [aquascraper github](https://github.com/nodes777/aquascraper).

## APIs, Frameworks, Sources

* [Aquabid.com](http://www.aquabid.com/)
* [Aquascraper](https://github.com/nodes777/aquascraper)
* [D3 v4](https://d3js.org/)
* [Firebase API](https://firebase.google.com/docs/database/rest/retrieve-data)
* [jQuery](https://jquery.com/)

## To Dos

* Ensure accessibility of charts

## Bugs

* Daily Bar Chart: If no auctions are closed with a specific fish type, that fish type is not represented on the x axis and not in the drop down select. If there are closed auctions but none in that category were sold, then there is an x axis label with a bar height of 0.

## Attributions

* [Aquabid.com](http://www.aquabid.com/)