# TO DO:

# SOMETIMES Firebase doesn't return in time, or returns too fast
* This causes errors with value in portfolio being displayed and login name

## Game:

* Paid, Dollar Change, and Percent Change are not implemented correctly - Double check, this may be fixed after updating makeSale to edit p[fishType].paid

* Make fades on changes to portfolio, on individual cells (Must check if that cell already exists, find it, fade it and change it)

* Add accessible on hover descriptions for cash/value/average/paid etc on home, leaderboard, and portfolio pages.

* Add Market Avg to profile and leaderboard line graph

* Figure out Responsify on the graphs

## Accessibility
* Better indication of focus
* Hide the axes
* provide programmatic access to bar or line graph nodes
* For tables add aria-label to number to buy and total? for both buying and selling


## Leaderboard page
* Sort by Cash/Avg too

## Line Graph
* Associate lines and colors

## Scraper:
* Links to fish closed auction pages, or maybe just images?

## Bug Notes
* Daily Bar Chart: If no auctions are closed with a specific fish type, that fish type is not represented on the x axis and not in the drop down select. If there are closed auctions but none in that category were sold, then there is an x axis label with a bar height of 0.



## AI:



