// Circle Packing
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/050.1-circlepackinganimated.html
// https://thecodingtrain.com/CodingChallenges/050.2-circlepackingimage.html

// Basic: https://editor.p5js.org/codingtrain/sketches/2_4gyDD_9
// Image (Text): https://editor.p5js.org/codingtrain/sketches/wxGRAd4I-
// Image (Kitten): https://editor.p5js.org/codingtrain/sketches/tRpryH_um

class Circle {
  constructor(x, y, r, color, level) {
    this.x = x;
    this.y = y;
    this.r = 0.001;
    this.objective_r = r;
    this.color = color;
    this.growing = true;
    this.level = level;
  }

  grow() {
    if (this.growing) {
      if(this.r * 1.22474487139 > this.objective_r){
        this.r = this.objective_r;
        this.growing = false;
      }
      else this.r *= 1.22474487139;
    }
  }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
