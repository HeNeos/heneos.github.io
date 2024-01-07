const steps = [ STEPS ];

const movements = [ MOVEMENTS ];


function stateToRGBArray(encodedState) {
  let bottles = encodedState.split(',');
  let colorsArray = [];

  for (let i = 0; i < bottles.length; i++) {
      let liquids = bottles[i].split(' ');
      let bottleColors = [];
      for (let j = 0; j < liquids.length; j++) {
          let liquid = liquids[j];
          let color = getColorRGB(liquid);
          bottleColors.push(color);
      }

      colorsArray.push(bottleColors);
  }

  return colorsArray;
}

function getColorRGB(code) {
  // Map color codes to RGB values
  switch (code) {
      case '0':
          return [255, 255, 255]; // White (blank color)
      case '1':
          return [255, 0, 0]; // Red
      case '2':
          return [0, 255, 0]; // Green
      case '3':
          return [0, 0, 255]; // Blue
      case '4':
          return [255, 255, 0]; // Yellow
      case '5':
          return [128, 0, 128]; // Purple
      default:
          return [0, 0, 0]; // Default to black for unknown colors
  }
}


const bottleWidth = 80;
const bottleHeight = 480;
const separation = 40;

let currentStepIndex = 0;
let currentState;
let nextTargetState;
let animationDuration = 10;
let currentFrame = 0;

function setup() {
  createCanvas(800, 600);
  currentState = steps[currentStepIndex];
  nextTargetState = steps[currentStepIndex + 1];
}

function draw() {
  background(255);
  translate(width / 2 - 1.5 * (bottleWidth * 2 + separation), height / 2 - 1.5 * (bottleHeight / 2));

  const current = stateToRGBArray(currentState);
  const next = stateToRGBArray(nextTargetState);

  let interpolatedState = interpolateStates(current, next, currentFrame, animationDuration);
  drawState(interpolatedState, bottleWidth, separation);

  currentFrame++;

  fill(0);
  textAlign(CENTER, CENTER);
  text("MOVEMENT: " + movements[currentStepIndex], 0, 80);

  // Extracting source, target, and amount from the movement string
  const [source, target, amount] = movements[currentStepIndex].split(' ').map(Number);

  // Drawing arrow
  drawArrow(
      source * 0.8*(bottleWidth + separation) + bottleWidth / 2,
      110,
      target * 0.8*(bottleWidth + separation) + bottleWidth / 2,
      110,
      bottleWidth,
      separation
  );

  if (currentFrame > animationDuration) {
      currentState = nextTargetState;
      currentFrame = 0;
      currentStepIndex++;

      if (currentStepIndex < steps.length - 1) {
          nextTargetState = steps[currentStepIndex + 1];
      } else {
          noLoop(); // Stop the animation when all steps are completed
      }
  }
}



function interpolateStates(currentState, nextState, frame, totalFrames) {
  let interpolatedState = [];

  for (let i = 0; i < currentState.length; i++) {
      let currentBottle = currentState[i];
      let nextBottle = nextState[i];
      let interpolatedBottle = [];

      for (let j = 0; j < currentBottle.length; j++) {
          let currentColor = currentBottle[j];
          let nextColor = nextBottle[j];

          let interpolatedColor = interpolateColors(currentColor, nextColor, frame, totalFrames);
          interpolatedBottle.push(interpolatedColor);
      }

      interpolatedState.push(interpolatedBottle);
  }

  return interpolatedState;
}

function interpolateColors(color1, color2, frame, totalFrames) {
  let interpolatedColor = [];

  for (let i = 0; i < color1.length; i++) {
      let value1 = color1[i];
      let value2 = color2[i];

      let interpolatedValue = Math.round(lerp(value1, value2, frame / totalFrames));
      interpolatedColor.push(interpolatedValue);
  }

  return interpolatedColor;
}

function drawState(interpolatedState) {
  for (let i = 0; i < interpolatedState.length; i++) {
      let bottleColors = interpolatedState[i];
      let liquidHeight = bottleHeight / bottleColors.length;

      for (let j = 0; j < bottleColors.length; j++) {
          let color = bottleColors[j];

          fill(color[0], color[1], color[2]);
          stroke(0);
          rect(i * 0.8*(bottleWidth + separation), height - (j+1) * liquidHeight, bottleWidth, liquidHeight);
      }
  }
}

function drawArrow(x1, y1, x2, y2) {
  const arrowSize = 8;

  // Draw line
  line(x1, y1+10, x1, y1);
  line(x1, y1, x2, y2);

  // Calculate arrowhead angle
  let angle = 3.14159265/2;
  if(x2 > x1) angle *= -1;

  // Draw arrowhead
  push();
  translate(x2, y2);
  rotate(angle);
  triangle(
      -arrowSize / 2, 0,
      arrowSize / 2, 0,
      0, arrowSize
  );
  pop();
}