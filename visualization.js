// ===============================================
// Part 2.1: Side-by-side Box Plot
// ===============================================

// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    const margin1 = {top: 40, right: 30, bottom: 70, left: 60};
    const width1 = 800 - margin1.left - margin1.right;
    const height1 = 500 - margin1.top - margin1.bottom;

    // Create the SVG container
    const svg1 = d3.select("#boxplot")
        .append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", `translate(${margin1.left},${margin1.top})`);

    // Set up scales for x and y axes
    const xScale = d3.scaleBand()
        .domain(['Adolescent Adults', 'Mature Adults', 'Senior Adults'])
        .range([0, width1])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([height1, 0]);

    // Add scales
    svg1.append("g")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(xScale));

    svg1.append("g")
        .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg1.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width1 / 2)
        .attr("y", height1 + 50)
        .text("Age Group");

    // Add y-axis label
    svg1.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height1 / 2)
        .attr("y", -40)
        .text("Number of Likes");

    // Define the rollup function to calculate quantiles
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values);
        return {min, q1, median, q3, max};
    };

    // This line groups the data by AgeGroup and applies the rollupFunction to calculate
    // quantile statistics (min, q1, median, q3, max) for each group.
    // The result is a Map object where keys are age groups and values are the calculated statistics.
    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);

    // This forEach loop iterates through each age group and its calculated quantiles.
    // For each group, it extracts the x-position and width from the xScale,
    // which will be used to position and size the box plot elements.
    quantilesByGroups.forEach((quantiles, AgeGroup) => {
        const x = xScale(AgeGroup);
        const boxWidth = xScale.bandwidth();

        // Draw vertical line from min to max
        svg1.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(quantiles.min))
            .attr("y2", yScale(quantiles.max))
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Draw box from q1 to q3
        svg1.append("rect")
            .attr("x", x)
            .attr("y", yScale(quantiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quantiles.q1) - yScale(quantiles.q3))
            .attr("fill", "#69b3a2")
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Draw median line
        svg1.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quantiles.median))
            .attr("y2", yScale(quantiles.median))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    });
});


// ===============================================
// Part 2.2: Side-by-side Bar Plot
// ===============================================

// Prepare and load the data
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    const margin2 = {top: 40, right: 150, bottom: 70, left: 60};
    const width2 = 900 - margin2.left - margin2.right;
    const height2 = 500 - margin2.top - margin2.bottom;

    // Create the SVG container
    const svg2 = d3.select("#barplot")
        .append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

    // Define four scales
    const x0 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.Platform))])
        .range([0, width2])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain([...new Set(data.map(d => d.PostType))])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes) * 1.1])
        .range([height2, 0]);

    const color = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.PostType))])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Add scales x0 and y
    svg2.append("g")
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(x0));

    svg2.append("g")
        .call(d3.axisLeft(y));

    // Add x-axis label
    svg2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width2 / 2)
        .attr("y", height2 + 50)
        .text("Platform");

    // Add y-axis label
    svg2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height2 / 2)
        .attr("y", -40)
        .text("Average Likes");

    // Group container for bars
    const barGroups = svg2.selectAll("bar")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.Platform)},0)`);

    // Draw bars
    barGroups.append("rect")
        .attr("x", d => x1(d.PostType))
        .attr("y", d => y(d.AvgLikes))
        .attr("width", x1.bandwidth())
        .attr("height", d => height2 - y(d.AvgLikes))
        .attr("fill", d => color(d.PostType));

    // Add the legend
    const legend = svg2.append("g")
        .attr("transform", `translate(${width2 - 150}, ${margin2.top})`);

    const types = [...new Set(data.map(d => d.PostType))];

    types.forEach((type, i) => {
        // Add colored rectangle for legend
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(type));

        // Add text information for the legend
        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .text(type)
            .attr("alignment-baseline", "middle");
    });
});


// ===============================================
// Part 2.3: Line Plot
// ===============================================

// Prepare and load the data
const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    const margin3 = {top: 40, right: 30, bottom: 100, left: 60};
    const width3 = 800 - margin3.left - margin3.right;
    const height3 = 500 - margin3.top - margin3.bottom;

    // Create the SVG container
    const svg3 = d3.select("#lineplot")
        .append("svg")
        .attr("width", width3 + margin3.left + margin3.right)
        .attr("height", height3 + margin3.top + margin3.bottom)
        .append("g")
        .attr("transform", `translate(${margin3.left},${margin3.top})`);

    // Set up scales for x and y axes
    const xScale3 = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([0, width3])
        .padding(0.1);

    const yScale3 = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.AvgLikes) * 1.1])
        .range([height3, 0]);

    // Draw the axes with rotated x-axis labels
    svg3.append("g")
        .attr("transform", `translate(0,${height3})`)
        .call(d3.axisBottom(xScale3))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    svg3.append("g")
        .call(d3.axisLeft(yScale3));

    // Add x-axis label
    svg3.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width3 / 2)
        .attr("y", height3 + 80)
        .text("Date");

    // Add y-axis label
    svg3.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height3 / 2)
        .attr("y", -40)
        .text("Average Likes");

    // Draw the line and path using curveNatural
    const line = d3.line()
        .x(d => xScale3(d.Date) + xScale3.bandwidth() / 2)
        .y(d => yScale3(d.AvgLikes))
        .curve(d3.curveNatural);

    svg3.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#4682b4")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add data points
    svg3.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale3(d.Date) + xScale3.bandwidth() / 2)
        .attr("cy", d => yScale3(d.AvgLikes))
        .attr("r", 4)
        .attr("fill", "#4682b4");
});