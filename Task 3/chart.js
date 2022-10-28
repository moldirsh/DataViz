let dimensions = {
    width: window.innerWidth * 0.6,
    height: 400,
    margin: {
        top: 30,
        left: 30,
        bottom: 30,
        right: 30
    }
}

dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

let wrapper = d3.select("#wrapper").append("svg");
wrapper.attr("width", dimensions.width);
wrapper.attr("height", dimensions.height);
let container = wrapper.append("g");
container.attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

function scatterPlot(){
    var circleData = d3.range(100).map(() => ({
        "x": Math.random() * 10,
        "y": Math.random() * 10
    }));
    var rhombusData = d3.range(100).map(() => ({
        "x": Math.random() * 10,
        "y": Math.random() * 10
    }));

    const xAccessor = d => d.x;
    const yAccessor = d => d.y;

    let dataset = d3.merge([circleData, rhombusData])

    let xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([dimensions.margin.left, dimensions.boundedWidth]);
    let yScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.margin.top, dimensions.boundedHeight]);

    let circle = container.selectAll("circle")
        .data(circleData)
        .enter()
        .append("path")
        .attr("class", "circle")
        .attr("cx", d => xScaler(xAccessor(d)))
        .attr("cy", d => yScaler(yAccessor(d)))
        .attr("r", "1") //circle size
        .attr("fill", "#32CD32")
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .attr("transform", function (d) {
            return "translate(" + xScaler(xAccessor(d)) + "," + yScaler(yAccessor(d)) + ")";
        });

    let rhombus = container.selectAll("rhombus")
        .data(rhombusData)
        .enter()
        .append("path")
        .attr("class", "rhombus")
        .attr("cx", d => xScaler(xAccessor(d)))
        .attr("cy", d => yScaler(yAccessor(d)))
        .attr("r", "1")
        .attr("fill", "orange")
        .attr("d", d3.symbol().type(d3.symbolDiamond))
        .attr("transform", function (d) {
            return "translate(" + xScaler(xAccessor(d)) + "," + yScaler(yAccessor(d)) + ")";
        });

    let xAxisGen = d3.axisBottom().scale(xScaler).tickValues([]);
    let yAxisGen = d3.axisLeft().scale(yScaler).tickValues([]);

    const axisX = container.append("g")
        .call(xAxisGen)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    const axisy = container.append("g")
        .call(yAxisGen)
        .style("transform", `translateX(${dimensions.margin.left}px)`)

    container.append('text') //X label
        .attr('x', dimensions.boundedWidth + 10)
        .attr('y', dimensions.boundedHeight)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Monospace')
        .style('font-size', 12)
        .text('X');
    container.append('text') //Y label
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, 20)')
        .style('font-family', 'Monospace')
        .style('font-size', 12)
        .text('Y');
}
d3.select("#generateButton").on("click", function(d) {
    scatterPlot()
})

d3.select("#clearButton").on("click", function(d) {
    wrapper.remove()
    container.remove()

    wrapper = d3.select("#wrapper").append("svg");
    wrapper.attr("width", dimensions.width);
    wrapper.attr("height", dimensions.height);
    container = wrapper.append("g");
    container.attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
})

scatterPlot()