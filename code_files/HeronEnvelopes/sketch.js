let polygons = []; // Array to store polygons
let frames = 60; // Number of frames in the animation
let currentFrame = 0; // Current frame
let currentPolygonIndex = 0;
let coordinatesLoaded = false; // Flag to check if coordinates are loaded

P5Capture.setDefaultOptions({
  format:"mp4",
  frameRate: 60,
  quality: 1,
  disableScaling: True
});

function preload() {
  // Load the coordinates from the file
  loadStrings('HeronEnvelopes.txt', parseCoordinates);
}

function setup() {
  createCanvas(800, 800);
  pixelDensity(2.0);
  // translate(-50, 1000); // Move the origin to the top-left corner of the visible area
}

function draw() {
  background(255);

  // Check if coordinates are loaded
  if (coordinatesLoaded) {
    // Draw each polygon
    for (let i = 0; i < polygons.length; i+=1) {
      drawPolygon(polygons[i], currentFrame/frames);
    }

    // Increment current frame
    currentFrame = (currentFrame + 1) % frames;

    if(currentFrame === 0){
      currentPolygonIndex = (currentPolygonIndex+1);
    }
  }
}

// Function to parse coordinates from the loaded strings
function parseCoordinates(data) {
  for (let i = 0; i < data.length; i++) {
    // Remove parentheses and split the string
    let cleanCoordinates = data[i].replace(/[()]/g, '').split(',').map(coord => parseInt(coord.trim()));
    
    // Check if there are an even number of coordinates
    if (cleanCoordinates.length % 2 === 0) {
      polygons.push(createPolygon(...cleanCoordinates));
    } else {
      console.error('Invalid number of coordinates in line:', data[i]);
    }
  }
  // Set the flag to true when coordinates are loaded
  coordinatesLoaded = true;
}

// Function to create a polygon
function createPolygon(...points) {
  let polygon = [];
  for (let i = 0; i < points.length; i+=2) {
    polygon.push(createVector(400 + points[i]/5, 800 - points[i + 1]/5));
  }
  return polygon;
}

// Function to draw a polygon with interpolation
function drawPolygon(polygon, t) {
  let variation = 11;
  let polygon_stroke = min(255, 0.00000018*pow(polygon[0].x, 1.8)*pow(polygon[0].y, 1.5));
  fill(25 * variation, 25 * variation, 25 * variation, 170); // Adjust the RGB values and alpha as needed
  
  stroke(0 * variation, 0 * variation, 0 * variation, polygon_stroke);

  beginShape();
  for (let i = 0; i < polygon.length; i++) {
    let nextIndex = (i + 1) % polygon.length;
    let x = lerp(polygon[i].x, polygon[nextIndex].x, t);
    let y = lerp(polygon[i].y, polygon[nextIndex].y, t);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// Function to interpolate between two polygons
function interpolatePolygon(polygon, t) {
  let interpolatedPolygon = [];
  for (let i = 0; i < polygon.length; i++) {
    let x = lerp(polygon[i].x, polygon[(i + 1) % polygon.length].x, t);
    let y = lerp(polygon[i].y, polygon[(i + 1) % polygon.length].y, t);
    interpolatedPolygon.push(createVector(x, y));
  }
  return interpolatedPolygon;
}

