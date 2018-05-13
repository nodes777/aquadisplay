Had trouble passing parameters to the the dots.on("mouseover", showTooltipMouse) event handler.
* Ended up using d3.select(this) to get a reference to the dots
* Used d3.select("#tooltip") to get reference to the tooltip html
* Used d3.select("svg").node().getBoundingClientRect().height to get height of graph for keyboard tooltip placement
*