// <!-- Recieved help from Florin Pop Youtuber who explains how to work on ScatterPlot Graph from this youtube channel: https://www.youtube.com/watch?v=DB_DunPM7wU&ab_channel=FlorinPop
// I reccomend likeing and subscribeing he explains things really well! --> */

const tooltip = document.getElementById('tooltip');

async function run() {

  const kickRes = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json');
  const kickstarter = await kickRes.json();

  // const countiesResp = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
  // const counties = await countiesResp.json();

  const width = 960;
  const height = 600;
  // const padding = 60;

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // color scheme with 10 catergorys more created though better then assigning colors indvidiually

  //   const path = d3.geoPath();

  //   const data = topojson.feature(counties, counties.objects.counties).features;

  //   const minEdu = d3.min(educations, edu => edu.bachelorsOrHigher);
  //   const maxEdu = d3.max(educations, edu => edu.bachelorsOrHigher);
  //   const step = ((maxEdu - minEdu) / 8);

  //   const colorsScale = d3.scaleThreshold()
  //   .domain(d3.range(minEdu, maxEdu, step))
  //            .range(d3.schemePurples[9])
  //   const colors = [];        

  //   for(let i=minEdu; i<=maxEdu; i+= step) {
  //     colors.push(colorsScale(i));
  //   }

  const svg = d3.select('#container').append('svg').
  attr('width', width).
  attr('height', height);

  const treemap = d3.treemap().
  size([width, height]).
  padding(1);

  const root = d3.hierarchy(kickstarter).
  sum(d => d.value);

  treemap(root);

  const cell = svg.selectAll('g').
  data(root.leaves()).
  enter().append('g').
  attr('transform', d => `translate(${d.x0}, ${d.y0})`); //x0 and y0 top left cornor of boxes

  const tile = cell.append('rect').
  attr('class', 'tile').
  attr('data-name', d => d.data.name).
  attr('data-category', d => d.data.category).
  attr('data-value', d => d.data.value).
  attr('width', d => d.x1 - d.x0) //button right cornor
  .attr('height', d => d.y1 - d.y0) // button right lower w
  .attr('fill', d => color(d.data.category)) // pass in a color function wil give you a color for catorgory passed in
  .on('mouseover', (d, i) => {
    const { name, category, value } = d.data;
    tooltip.classList.add('show');
    tooltip.style.left = d3.event.pageX + 'px';
    tooltip.style.top = d3.event.pageY - 100 + 'px';
    tooltip.setAttribute('data-value', value);

    tooltip.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Value:</strong> ${value}</p>
      `;
  }).on('mouseout', () => {
    tooltip.classList.remove('show');
  });

  //displays all texts for 
  cell.append('text').
  selectAll('tspan').
  data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)) //loops over and uses regex to find uppercase letters
  .enter().append('tspan').
  attr('style', 'font-size: 13px').
  attr('x', 4).
  attr('y', (d, i) => 15 + i * 15).
  text(d => d);

  const categories = root.leaves().map(n => n.data.category).filter((item, idx, arr) => arr.indexOf(item) === idx); // removes duplicated product designs 

  const blockSize = 20;
  const legendWidth = 200;
  const legendHeight = (blockSize + 2) * categories.length;

  // const legendRectWidth = legendWidth / colors.length;
  const legend = d3.select('body').
  append('svg').
  attr('id', 'legend').
  attr('width', legendWidth).
  attr('height', legendHeight);


  // .selectAll('rect')
  // .data(colors)
  // .enter()
  // .append('rect')
  // .attr('x', (_,i) => i * legendRectWidth)
  // .attr('y', 0)
  // .attr('width', legendRectWidth)
  // .attr('height', legendHeight)
  // .attr('fill', c=> c)

  legend.selectAll('rect').
  data(categories).
  enter().
  append('rect').
  attr('class', 'legend-item').
  attr('fill', d => color(d)).
  attr('x', blockSize / 2).
  attr('y', (_, i) => i * (blockSize + 1) + 10).
  attr('width', blockSize).
  attr('height', blockSize);

  legend.append('g').
  selectAll('text').
  data(categories).
  enter().
  append('text').
  attr('fill', 'black').
  attr('x', blockSize * 2).
  attr('y', (_, i) => i * (blockSize + 1) + 25).
  text(d => d);




  //   svg.append('g')
  //   .selectAll('path')
  //   .data(data)
  //   .enter()
  //   .append('path')
  //   .attr('class', 'county')
  //   .attr('fill', d => 
  //     colorsScale(educations.find(edu => edu.fips === d.id).bachelorsOrHigher))
  //     .attr('d', path)
  //   .attr('data-fips', d => d.id)
  //   .attr('data-education', d => 
  //      educations.find(edu => edu.fips === d.id).bachelorsOrHigher) //impllict return
  //  .on('mouseover', (d, i) => {
  //     const { coordinates } = d.geometry;
  //     const [x, y] = coordinates[0][0]; // array structureing we get x and y from coordinates

  //     const education = educations.find(edu => edu.fips === d.id); // looks for id within fips which is then put into const value educations and set equal to education

  //       tooltip.classList.add('show');
  //       tooltip.style.left = x - 50 + 'px';
  //       tooltip.style.top = y - 50 +'px';
  //       tooltip.setAttribute('data-education', education.bachelorsOrHigher)

  //       tooltip.innerHTML = `
  //         <p>${education.area_name} - ${education.state}</p>
  //         <p>${education.bachelorsOrHigher}%</p>
  //       `;
  //   }).on('mouseout', () => {
  //      tooltip.classList.remove('show');
  //   });

  // create axis
  // const xAxis = d3.axisBottom(xScale)
  // .tickFormat(d3.format('d'));
  // const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
  //   const date = new Date(0);
  //   date.setUTCMonth(month);
  //   return d3.timeFormat('%B')(date); 
  // });

  //   svg.append('g')
  //     .attr('id', 'x-axis')
  //     .attr('transform', `translate(0, ${height - padding + cellHeight})`)
  //     .call(xAxis);

  //   svg.append('g')
  //     .attr('id', 'y-axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis)

  //creating a legend!
  //   const legendWidth = 200;
  //   const legendHeight = 50;

  //   const legendRectWidth = legendWidth / colors.length;
  //   const legend = d3.select('body')
  //   .append('svg')
  //   .attr('id', 'legend')
  //   .attr('width', legendWidth)
  //   .attr('height', legendHeight)
  //   .selectAll('rect')
  //   .data(colors)
  //   .enter()
  //   .append('rect')
  //   .attr('x', (_, i) => i * legendRectWidth)
  //   .attr('y', 0)
  //   .attr('width', legendRectWidth)
  //   .attr('height', legendHeight)
  //   .attr('fill', c => c)


}

run();