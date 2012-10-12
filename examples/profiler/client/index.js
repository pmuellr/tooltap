// Licensed under the Tumbolia Public License. See footer for details.

tooltap.serviceWatch("profiler", profilerWatcher)

var ProfilersMap  = {}

//------------------------------------------------------------------------------
function profilerWatcher(action, service) {

    if (action == "connect") {
        var profiler = new Profiler(service)
        tooltap.serviceExtendObjectWithIntf(profiler, service)

        ProfilersMap[service.id] = profiler

        addProfiler(profiler)
    }

    if (action == "disconnect") {
        var profiler = ProfilersMap[service.id]

        delete ProfilersMap[service.id]

        removeProfiler(profiler)
    }
}

//------------------------------------------------------------------------------
function Profiler(service) {
    this.service = service
}

//------------------------------------------------------------------------------
function addProfiler(profiler) {

}

//------------------------------------------------------------------------------
function removeProfiler(profiler) {

}

//------------------------------------------------------------------------------
function showProfileChart(profile) {
    var title = profile.title
    var root  = profile.head

    partitionize(root)

    var partition = d3.layout.partition()
        .value(function(d) { return d.selfTime })
        .sort(null)

    var nodes = partition.nodes(root)
    var depth = Math.max.apply(null, nodes.map(function(d) { return d.depth }))

    $("#profiles-chart svg").remove()

    var w = 1000
    var h = 60 * depth
    var x = d3.scale.linear().range([0, w])
    var y = d3.scale.linear().range([0, h])

    var chart = d3.select("#profiles-chart")
        .attr("class", "chart")
        .style("width",  w + "px")
        .style("height", h + "px")

    var svg = chart.append("svg:svg")
        .attr("width",  w)
        .attr("height", h)

    var g = svg.selectAll("g")
        .data(nodes)
    .enter().append("svg:g")
        .attr("transform", function(d) {
            return "translate(" + x(d.x) + "," + (h - y(d.y) - 60) + ")";
        })
        .on("click",     click)
        .on("mouseover", updateIdentifiedNode);

    g.append("svg:rect")
        .attr("width",  function(d) { return x(d.dx) })
        .attr("height", function(d) { return y(d.dy) })
        .attr("class",  function(d) { return "parent" })
        .style("opacity", function(d) {
            if (!d.parent) return 1;
            if (d.parent && d.parent.totalTime >= 0 && d.totalTime >= 0) {
                var value = 0.3 + (0.7 * (d.totalTime / d.parent.totalTime))
                return value
            }
        })
        .classed("invisible", function(d) { return d.invisible });

    g.append("svg:clipPath")
        .property("id", function(d,i) { return "text-clip-path-" + i})
        .classed("clippath", true)
    .append("svg:rect")
        .attr("width",  function(d) { return x(d.dx) })
        .attr("height", function(d) { return y(d.dy) })

    g.append("svg:text")
        .attr("x", function(d) {return x(d.dx)/2})
        .attr("y", h / depth - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .attr("font-family", "Verdana")
        .style("clip-path", function(d,i) {
            return "url(#text-clip-path-" + i + ")"}
        )
        .text(function(d) {
            if (d.invisible) return ""
            var func = d.functionName || "<anon>"
            return func + "()"
        })

    d3.select(window)
        .on("click", function() { click(root); })

    function click(d) {
        if (!d.children) return;

        d3.event.stopPropagation()

        var scale  = w / x(d.dx)
        var offset = - x(d.x) * scale

        var t = g.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) {
                return "translate(" +
                    (offset + scale * x(d.x)) + "," +
                    (h - y(d.y) - 60) +
                ")"
            })

        t.select("rect")
            .attr("width",  function(d) { return scale * x(d.dx) })

        t.select(".clippath").select("rect")
            .attr("width",  function(d) { return scale * x(d.dx) })

        t.select("text")
            .attr("text-anchor", "middle")
            .attr("x", function(d) {return scale * x(d.dx)/2})
    }
}

//------------------------------------------------------------------------------
function updateProfiles(profiles) {
    var table = d3.select("#profiles-table")
    var tr    = table.selectAll("tr").data(profiles, function(d) {return d.url})

    tr.exit().remove()
    var trNew = tr.enter().append("tr")

    tr.sort(function (a,b) { return b.url.localeCompare(a.url) })

    trNew.html(function(d) {
        return "" +
            "<td class='profile-name' title='show this profile'>" + d.name +
            "<td><div class='trash-can' title='delete this profile'></div>"
    })

    trNew.each(function(d) {
        d3.select(this).select(".profile-name").on("click", function(){
            rsprofiler.showProfile(d.url)
        })
        d3.select(this).select(".trash-can").on("click", function(){
            rsprofiler.deleteProfile(d.url)
        })
    })
}

//------------------------------------------------------------------------------
function updateIdentifiedNode(node) {
    if (node.invisible) return

    var func = node.functionName
    var file = node.url
    var line = node.lineNumber

    if (!func || func == "")
        func = "<anonymous>"
    else
        func += "()"

    if (!file || file == "") file = "<no file>"
    if (!line)               line = ""

    var message = func + " in " + file + ":" + line + "\n" +
        "   called:    " + node.numberOfCalls + " times\n" +
        "   selfTime:  " + node.selfTime      + "\n" +
        "   totalTime: " + node.totalTime

    $("#identified-node").text(message)
}

//------------------------------------------------------------------------------
// typical profiling data - selfTime/totalTime values on all nodes in a tree -
// is not how a partition tree in d3 is specified.  In d3, a partition only
// considers "values" on leaf nodes, and not non-leaf nodes.  So, for d3,
// we'll use "selfTime" as the value, and for every non-leaf node, we'll add
// a new child leaf node with the "selfTime" value.  Kinda wonky, but the
// data model works.  Maybe color those synthethic nodes transparent?
// Also, remove children property when there are no children.
//------------------------------------------------------------------------------
function partitionize(node) {
    if (node.children.length == 0) delete node.children
    if (!node.children) return

    node.children.forEach(function(child){
        partitionize(child)
    })

    // add a new child for our self time
    node.children.push({
        selfTime:  node.selfTime,
        invisible: true
    })
}

//------------------------------------------------------------------------------
// Copyright (c) 2012 Patrick Mueller
//
// Tumbolia Public License
//
// Copying and distribution of this file, with or without modification, are
// permitted in any medium without royalty provided the copyright notice and
// this notice are preserved.
//
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//   0. opan saurce LOL
//------------------------------------------------------------------------------
