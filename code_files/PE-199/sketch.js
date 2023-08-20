let circles = [];
let all_circles = [];
let currentLevel = 0;
let finish = false;
let top_level = 1;
let maxLevel = 10;
let r_0 = 500;
let count_level = Array(maxLevel+1).fill(0);
let r_1 = r_0 * Math.sqrt(3) / (2 + Math.sqrt(3));
let c0 = { r: -r_0, x: 0, y: 0 };
let c1 = { r: r_1, x: 0, y: r_0 - r_1 };
let c2 = { r: r_1, x: Math.sqrt(3) * (r_0 - r_1) / 2, y: -(r_0 - r_1) / 2 };
let c3 = { r: r_1, x: -Math.sqrt(3) * (r_0 - r_1) / 2, y: -(r_0 - r_1) / 2};  
let colors = [
  '#000004',
  '#0d0a29',
  '#20114b',
  '#3b0f70',
  '#57157e',
  '#721f81',
  '#8c2981',
  '#a8327d',
  '#c43c75',
  '#de4968',
  '#f1605d',
  '#fa7f5e',
  '#fe9f6d',
  '#febf84',
  '#fddea0',
  '#fcfdbf'
];

P5Capture.setDefaultOptions({
  format: "mp4",
  framerate: 120,
  quality: 1,
  width: 1000,
  disableScaling: true
});


function setup() {
  createCanvas(1000, 1000);
  background(255);
  pixelDensity(1);
  frameRate(90);
  // requestAnimationFrame(draw);
  // circles.push([c0, c1, c2]);
  // circles.push([c0, c1, c3]);
  // circles.push([c0, c2, c3]);
  // circles.push([c1, c2, c3]);
  
  generate_all_circles();
}

function generate_all_circles(){
  circles = [];
  all_circles = [];
  currentLevel = 0;
  let C0 = new Circle(c0.x, c0.y, abs(c0.r), colors[0], 0);
  let C1 = new Circle(c1.x, c1.y, c1.r, colors[1], 0);
  let C2 = new Circle(c2.x, c2.y, c2.r, colors[1], 0);
  let C3 = new Circle(c3.x, c3.y, c3.r, colors[1], 0);
  count_level[0] = 4;
  circles.push([c0, c1, c2]);
  circles.push([c0, c1, c3]);
  circles.push([c0, c2, c3]);
  circles.push([c1, c2, c3]);
  all_circles.push(C0);
  all_circles.push(C1);
  all_circles.push(C2);
  all_circles.push(C3);
  for(let level=1; level<=maxLevel; level++){
    count_level[level] = count_level[level-1];
    if (currentLevel >= maxLevel) {
      circles = [];
      noLoop();
      break;
    }
    let newCircles = [];
    for (let levelCircles of circles) {
      let newCircle = genCircle(levelCircles);
      let { r, x, y } = newCircle;
      let color = colors[level+1];
      let C = new Circle(x, y, r, color, level);
      count_level[level]++;
      // fill(color);
      // stroke(0);
      // ellipse(x, y, abs(r * 2), abs(r * 2));
      newCircles.push([levelCircles[0], levelCircles[1], newCircle]);
      newCircles.push([levelCircles[0], levelCircles[2], newCircle]);
      newCircles.push([levelCircles[1], levelCircles[2], newCircle]);
      all_circles.push(C);
    }
    circles = newCircles;
    currentLevel++;
  }
}

function draw() {
  translate(width / 2, height / 2);
  let count = 0;
  for(let i=0; i<all_circles.length; i++){
    if(finish) break;
    let circl = all_circles[i];
    if(circl.level > top_level) break;
    circl.show();
    circl.grow();
    if(!circl.growing) count++;
  }
  if(count == count_level[top_level]) top_level++;
  if(count == all_circles.length) finish = true;
  if(finish){
    noLoop();
    save("circles.png");
  }
}

function genCircle(levelCircles) {
  let r0 = levelCircles[0].r;
  let r1 = levelCircles[1].r;
  let r2 = levelCircles[2].r;
  let k = 1 / r0 + 1 / r1 + 1 / r2 + 2 * Math.sqrt(1 / (r0 * r1) + 1 / (r1 * r2) + 1 / (r0 * r2));
  let r = 1 / k;

  let k0 = 1 / levelCircles[0].r;
  let k1 = 1 / levelCircles[1].r;
  let k2 = 1 / levelCircles[2].r;
  let x0 = levelCircles[0].x;
  let y0 = levelCircles[0].y;
  let x1 = levelCircles[1].x;
  let y1 = levelCircles[1].y;
  let x2 = levelCircles[2].x;
  let y2 = levelCircles[2].y;

  let Sx = k0 * k1 * (x0 * x1 - y0 * y1) + k1 * k2 * (x1 * x2 - y1 * y2) + k0 * k2 * (x0 * x2 - y0 * y2);
  let Sy = k0 * k1 * (y0 * x1 + y1 * x0) + k1 * k2 * (y1 * x2 + y2 * x1) + k0 * k2 * (y0 * x2 + y2 * x0);

  let Cx = Math.sqrt((Math.sqrt(Sx * Sx + Sy * Sy) + Sx) / 2);
  let Cy = 0;
  if (Sy !== 0) {
    Cy = Math.abs(Sy) / Sy * Math.sqrt((Math.sqrt(Sx * Sx + Sy * Sy) - Sx) / 2);
  } else if (Sx < 0) {
    Cy = Math.sqrt(-Sx);
  }

  let x_1 = (k0 * x0 + k1 * x1 + k2 * x2 + 2 * Cx) * r;
  let y_1 = (k0 * y0 + k1 * y1 + k2 * y2 + 2 * Cy) * r;
  let x_2 = (k0 * x0 + k1 * x1 + k2 * x2 - 2 * Cx) * r;
  let y_2 = (k0 * y0 + k1 * y1 + k2 * y2 - 2 * Cy) * r;

  let error1 = checkTangency({ r, x: x_1, y: y_1 }, levelCircles[0]) + checkTangency({ r, x: x_1, y: y_1 }, levelCircles[1]) + checkTangency({ r, x: x_1, y: y_1 }, levelCircles[2]);
  let error2 = checkTangency({ r, x: x_2, y: y_2 }, levelCircles[0]) + checkTangency({ r, x: x_2, y: y_2 }, levelCircles[1]) + checkTangency({ r, x: x_2, y: y_2 }, levelCircles[2]);

  if (error1 < error2) {
    return { r, x: x_1, y: y_1 };
  } else {
    return { r, x: x_2, y: y_2 };
  }
}

function checkTangency(c0, c1) {
  let x0 = c0.x;
  let y0 = c0.y;
  let x1 = c1.x;
  let y1 = c1.y;
  let D = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
  return Math.abs(Math.abs(c0.r + c1.r) - D);
}
