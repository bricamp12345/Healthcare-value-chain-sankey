
async function drawSankey() {
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#sankey-chart")
    .append("svg")
    .attr("width", width + margin.left)
    .attr("height", height + margin.top);

  const sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .extent([[1, 1], [width - 1, height - 6]]);

  const data = {
    nodes: [
      {name: "Patient Intake"},
      {name: "Diagnosis & Treatment Planning"},
      {name: "Clinical Services"},
      {name: "Discharge & Follow-up"},
      {name: "Billing & Claims"}
    ],
    links: [
      {source: 0, target: 1, value: 10},
      {source: 1, target: 2, value: 10},
      {source: 2, target: 3, value: 10},
      {source: 3, target: 4, value: 10}
    ]
  };

  sankey(data);

  svg.append("g")
    .selectAll("path")
    .data(data.links)
    .join("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", "#0077cc")
    .attr("stroke-width", d => Math.max(1, d.width));

  const node = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x0},${d.y0})`)
    .on("click", showAgents);

  node.append("rect")
    .attr("height", d => d.y1 - d.y0)
    .attr("width", sankey.nodeWidth())
    .attr("fill", "#69b3a2");

  node.append("text")
    .attr("x", -6)
    .attr("y", d => (d.y1 - d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(d => d.name)
    .filter(d => d.x0 < width / 2)
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");
}

function showAgents(d) {
  const activity = d.name;
  console.log(`User clicked: ${activity}`);
  const panel = document.getElementById("agent-panel");

  const agents = window.agentData[activity];
  if (agents) {
    panel.innerHTML = `<strong>${activity} Agents:</strong><ul>` +
      agents.map(agent => `<li><strong>${agent.name}</strong> - ${agent.description}</li>`).join('') +
      `</ul>`;
  } else {
    panel.innerHTML = `<strong>No agents listed for ${activity}</strong>`;
  }
}

drawSankey();
