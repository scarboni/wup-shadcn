const topology = require('world-atlas/land-50m.json');
const topojson = require('topojson-client');
const d3 = require('d3-geo');

const W = 320, H = 160;
const land = topojson.feature(topology, topology.objects.land);

// Use d3.geoContains for proper spherical point-in-polygon
// Convert pixel coords back to lon/lat
function pixelToLonLat(px, py) {
  const lon = (px / W) * 360 - 180;
  const lat = 90 - (py / H) * 180;
  return [lon, lat];
}

console.log("Rasterizing with d3.geoContains (spherical geometry)...");

const grid = [];
for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    const [lon, lat] = pixelToLonLat(px + 0.5, py + 0.5);
    if (d3.geoContains(land, [lon, lat])) {
      grid.push([py, px]);
    }
  }
  if (py % 10 === 0) process.stderr.write(`Row ${py}/${H}\n`);
}

console.log(`Total land dots: ${grid.length}`);
console.log(`Coverage: ${(100 * grid.length / (W * H)).toFixed(1)}%`);

// Clean up isolated dots in top 24 rows
const gridSet = new Set(grid.map(([y,x]) => y+","+x));
const cleaned = grid.filter(([y, x]) => {
  if (y >= 24) return true;
  let neighbors = 0;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (dy === 0 && dx === 0) continue;
      if (gridSet.has((y+dy)+","+(x+dx))) neighbors++;
    }
  return neighbors >= 3;
});

console.log(`After northern cleanup: ${cleaned.length} dots`);
console.log(`Row 16: ${cleaned.filter(([y]) => y===16).length} dots`);
console.log(`Row 19: ${cleaned.filter(([y]) => y===19).length} dots`);

// Output
const lines = [];
let currentY = -1;
let currentLine = [];
for (const [y, x] of cleaned) {
  if (y !== currentY) {
    if (currentLine.length) lines.push("    " + currentLine.join(",") + ",");
    currentLine = [];
    currentY = y;
  }
  currentLine.push(`[${y},${x}]`);
}
if (currentLine.length) lines.push("    " + currentLine.join(",") + ",");
require('fs').writeFileSync('/sessions/gracious-sharp-archimedes/d3_dots.txt', lines.join("\n"));

// ASCII preview
const cleanSet = new Set(cleaned.map(([y,x]) => y+","+x));
console.log("\nNorthern rows (2x downsampled):");
for (let y = 6; y <= 30; y++) {
  let row = "";
  for (let x = 0; x < 320; x += 2) {
    row += (cleanSet.has(y+","+x) || cleanSet.has(y+","+(x+1))) ? "#" : ".";
  }
  console.log("y=" + y.toString().padStart(2) + ": " + row);
}

console.log("\nFull map (4x downsampled):");
for (let y = 0; y < H; y += 4) {
  let row = "";
  for (let x = 0; x < W; x += 4) {
    let has = false;
    for (let dy = 0; dy < 4 && !has; dy++)
      for (let dx = 0; dx < 4 && !has; dx++)
        if (cleanSet.has((y+dy)+","+(x+dx))) has = true;
    row += has ? "#" : ".";
  }
  console.log(row);
}
