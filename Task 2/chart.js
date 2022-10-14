async function buildBarChart(buttonid, data) {
    const dataset = await d3.json("my_weather_data.json");

    //Accessor
    const xAccessor = d => d[data];
    const yAccessor = d => d.length;
    
    var dimension = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 30,
            left: 30,
            bottom: 20,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .html("")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounds = wrapper.append("g")
        .style("translate", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimension.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = binsGen(dataset);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor) + 10])
        .range([dimension.boundedHeight, 0])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const position = 80;
    const barPadding = 1
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding / 2 + position)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimension.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const mean = d3.mean(dataset, xAccessor);
    const meanLine = bounds.append("line")
        .attr("x1", xScaler(mean))
        .attr("x2", xScaler(mean))
        .attr("y1", -15)
        .attr("y2", dimension.boundedHeight)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x", xScaler(mean))
        .attr("y", 10)
        .text("Mean")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .attr("transform", `translate(${position},${dimension.boundedHeight} )`);

    const yAxisGen = d3.axisLeft()
        .scale(yScaler);
    const yAxis = bounds.append("g")
        .call(yAxisGen)
        .attr("transform", `translate(${position}, 0)`);

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)) / 2 + position)
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill", "darkgrey")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    const xLabel = bounds.append("text")
        .attr("x", dimension.boundedWidth - 40)
        .attr("y", dimension.boundedHeight + 40)
        .text("Temperature")

    const yLabel = bounds.append("text")
        .attr("x", 40)
        .attr("y", 30)
        .text("Count")
}

buildBarChart(null, "temperatureLow");



